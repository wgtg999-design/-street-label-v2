/** Server-only environment configuration; never derive trust from Host headers. */
function configuredOrigin(value) {
    if (!value?.trim())
        return null;
    if (/[\r\n\t"'`]/.test(value))
        return null;
    try {
        const url = new URL(value);
        if (url.username || url.password || url.pathname !== '/' || url.search || url.hash)
            return null;
        const secure = url.protocol === 'https:';
        const localDevelopment = process.env.NODE_ENV !== 'production' && url.protocol === 'http:'
            && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
        return secure || localDevelopment ? url.origin : null;
    }
    catch {
        return null;
    }
}
/** The exact previously entered public-key name is the only supported alias.
 * An explicitly configured canonical value always wins, even if invalid.
 * This never modifies the environment or substitutes a secret credential.
 */
export function getClerkPublishableKey() {
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== undefined) {
        return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    }
    return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE;
}
function fieldStatus(value, valid) {
    return value === undefined || value === '' ? 'missing' : valid ? 'ready' : 'invalid';
}
/** Public-safe metadata only: never include any key, URL or identity value. */
export function getAuthConfigurationStatus() {
    const publicKey = getClerkPublishableKey();
    // These checks only recognize configuration shape. Clerk remains responsible
    // for checking actual credentials and verifying every managed session.
    const publicMode = /^pk_(test|live)_[A-Za-z0-9+/_=-]+$/.exec(publicKey ?? '');
    const secretMode = /^sk_(test|live)_[A-Za-z0-9+/_=-]+$/.exec(process.env.CLERK_SECRET_KEY ?? '');
    return {
        siteUrl: fieldStatus(process.env.NEXT_PUBLIC_SITE_URL, configuredOrigin(process.env.NEXT_PUBLIC_SITE_URL) !== null),
        publishableKey: fieldStatus(publicKey, publicMode !== null),
        secretKey: fieldStatus(process.env.CLERK_SECRET_KEY, secretMode !== null),
        publishableKeySource: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== undefined ? 'canonical'
            : process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE !== undefined ? 'compatibility' : 'missing',
        keysMatch: publicMode !== null && secretMode !== null && publicMode[1] === secretMode[1],
    };
}
export function trustedOrigins() {
    const canonical = configuredOrigin(process.env.NEXT_PUBLIC_SITE_URL);
    if (!canonical)
        return [];
    const origins = [canonical];
    if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
        && /^[a-zA-Z0-9.-]+$/.test(process.env.VERCEL_URL)) {
        const preview = configuredOrigin(`https://${process.env.VERCEL_URL}`);
        if (preview && !origins.includes(preview))
            origins.push(preview);
    }
    return origins;
}
export function isTrustedOrigin(origin) {
    return origin !== null && trustedOrigins().includes(origin);
}
export function authConfigured() {
    const status = getAuthConfigurationStatus();
    return trustedOrigins().length > 0 && status.siteUrl === 'ready'
        && status.publishableKey === 'ready' && status.secretKey === 'ready'
        && status.keysMatch;
}
