import "./globals.css";

export const metadata = { title: "Frontend", description: "Next + Tailwind v4" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
