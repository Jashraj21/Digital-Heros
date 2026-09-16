import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata = {
  title: 'Digital Heroes | Play Golf. Give Back. Win Big.',
  description:
    'A performance-tracking and monthly charity prize draw platform for modern golfers. 10%+ of all subscription fees directly empower grassroots causes.',
  keywords: 'golf, charity, prize draw, stableford, digital heroes, golf performance, fundraising',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      </head>
      <body className="bg-background text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
