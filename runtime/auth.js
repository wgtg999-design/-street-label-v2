import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDatabase } from './database';
import { authConfigured } from './auth-config';
export { authConfigured, isTrustedOrigin } from './auth-config';
/** Require the managed cookie session AND a verified primary email. */
export async function getClerkAccountState() {
    if (!authConfigured())
        return { status: 'unavailable', user: null };
    try {
        const session = await auth();
        if (!session.userId)
            return { status: 'signed-out', user: null };
        const user = await currentUser();
        if (!user || user.id !== session.userId)
            return { status: 'unverified', user: null };
        const primary = user.emailAddresses.find(address => address.id === user.primaryEmailAddressId);
        if (!primary || primary.verification?.status !== 'verified' || !primary.emailAddress?.trim()) {
            return { status: 'unverified', user: null };
        }
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || null;
        return {
            status: 'verified',
            user: { providerUserId: user.id, email: primary.emailAddress.trim(), fullName },
        };
    }
    catch {
        // Missing/invalid credentials, invalid session tokens, and unavailable
        // provider services all fail closed. Never trust client oai-* headers.
        return { status: 'unavailable', user: null };
    }
}
export async function getChatGPTUser() {
    const account = await getClerkAccountState();
    if (account.status !== 'verified')
        return null;
    try {
        const link = await getDatabase().prepare('SELECT legacy_user_id, verified_at FROM auth_identity_links WHERE provider_user_id = ?').bind(account.user.providerUserId).first();
        if (link && (!link.legacy_user_id || !Number.isFinite(Date.parse(link.verified_at))))
            return null;
        return {
            userId: link?.legacy_user_id ?? `clerk:${account.user.providerUserId}`,
            displayName: account.user.fullName ?? account.user.email,
            email: account.user.email,
            fullName: account.user.fullName,
        };
    }
    catch {
        // A missing migration/DB must not produce an unlinked identity that could
        // bootstrap a replacement owner or detach an existing member's orders.
        return null;
    }
}
export async function requireChatGPTUser(returnTo) {
    const user = await getChatGPTUser();
    if (user)
        return user;
    redirect(chatGPTSignInPath(returnTo));
}
export function chatGPTSignInPath(returnTo) {
    return `/auth/sign-in?next=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`;
}
export function chatGPTSignOutPath(returnTo = '/') {
    return `/auth/sign-out?next=${encodeURIComponent(safeRelativeReturnPath(returnTo))}`;
}
/** Only internal return paths are accepted, including after Clerk callbacks. */
export function safeRelativeReturnPath(value) {
    if (typeof value !== 'string' || value.length > 2048 || !value.startsWith('/') || value.startsWith('//'))
        return '/';
    if (/[\\\u0000-\u0020\u007f]/.test(value))
        return '/';
    try {
        const url = new URL(value, 'https://store.invalid');
        if (url.origin !== 'https://store.invalid')
            return '/';
        let pathname = url.pathname;
        for (let iteration = 0; iteration < 4; iteration++) {
            const decoded = decodeURIComponent(pathname);
            if (/[\\\u0000-\u0020\u007f]/.test(decoded) || decoded.startsWith('//'))
                return '/';
            const normalized = new URL(decoded, 'https://store.invalid').pathname.toLowerCase();
            if (normalized === '/auth' || normalized.startsWith('/auth/') || [
                '/signin-with-chatgpt', '/signout-with-chatgpt', '/callback',
            ].some(path => normalized === path || normalized.startsWith(path + '/')))
                return '/';
            if (decoded === pathname)
                return `${url.pathname}${url.search}${url.hash}`;
            pathname = decoded;
        }
    }
    catch {
        return '/';
    }
    return '/';
}
