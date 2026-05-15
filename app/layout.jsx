import "./globals.css";
import AppShell from "../components/AppShell";
import Providers from "../components/Providers";
import { getCurrentUser } from "../lib/data/dashboard";

export const metadata = {
  title: "HomeBudget",
  description: "Personal budgeting app",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell userName={user?.name ?? null}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
