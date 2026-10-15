import { jsx as _jsx } from "react/jsx-runtime";
import { authConfigured, safeRelativeReturnPath } from '../../../runtime/auth';
import AuthUnavailable from '../unavailable';
import SignOutUI from './ui';
export const dynamic = 'force-dynamic';
export default async function SignOutPage({ searchParams }) {
    const next = safeRelativeReturnPath((await searchParams).next ?? '/');
    if (!authConfigured())
        return _jsx(AuthUnavailable, {});
    return _jsx(SignOutUI, { next: next });
}
