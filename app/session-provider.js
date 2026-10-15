'use client';
import {ClerkProvider} from '@clerk/nextjs';
import {usePathname} from 'next/navigation';
export default function SessionProvider({publishableKey,children}){
 const pathname=usePathname();
 // AuthUI owns its localized provider. Keep a provider on every other React
 // page so Clerk refreshes short-lived session JWTs during long editing.
 if(!publishableKey||pathname.startsWith('/auth/'))return children;
 return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
