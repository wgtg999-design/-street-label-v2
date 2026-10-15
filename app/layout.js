import './globals.css';
import SessionProvider from './session-provider';
import {authConfigured,getClerkPublishableKey} from '../runtime/auth-config';

export const metadata = {
  title: 'Street Label — Between the Shadows',
  description: '절제된 실루엣과 새로운 시선. Street Label 컬렉션.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return <html lang="ko"><body><SessionProvider publishableKey={authConfigured()?getClerkPublishableKey():null}>{children}</SessionProvider></body></html>;
}
