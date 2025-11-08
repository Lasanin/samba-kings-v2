import "./globals.css";
import { auth } from "../lib/auth";
import Header from "../components/Header";

export const metadata = {
  title: "Samba Kings",
  description: "Správa tréninků a kreditů",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="cs">
      <body className="max-w-5xl mx-auto p-6">
        <Header session={session} />
        {children}
      </body>
    </html>
  );
}
