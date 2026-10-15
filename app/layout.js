import './globals.css';

export const metadata = {
  title: 'Street Label V2 — 준비 중',
  description: '새 홈페이지 디자인을 준비하고 있습니다.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return <html lang="ko"><body>{children}</body></html>;
}
