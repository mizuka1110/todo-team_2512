import "./../styles/globals.css";

export const metadata = {
  title: "Todo App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        <header className="w-full h-16 bg-gray-300" />
        <main className="max-w-md mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}