import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MinhaFabrica | Gestão",
  description: "Painel de gestão de usuários e produtos da MinhaFabrica",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
