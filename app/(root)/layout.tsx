import type { Metadata } from "next";
import SiteFrame from "@/layouts/siteFrame";

export const metadata: Metadata = {
  title: "ID RCRDS",
  description: "ID RCRDS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteFrame>{children}</SiteFrame>;
}
