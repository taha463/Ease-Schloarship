import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ease Scholarship',
  description: 'Evidence-grounded scholarship, visa, university, and application guidance.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#FAF8F5] text-[#1C1E21] antialiased selection:bg-[#2D5A43] selection:text-white">
        {children}
      </body>
    </html>
  );
}
