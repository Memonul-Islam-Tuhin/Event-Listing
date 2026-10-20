import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/components/StoreProvider";
import Navbar from "@/components/Navbar";
import React from "react";

export const metadata: Metadata = {
  icons: {
    icon: "./favicon.ico",
  },
  title: "Eventify – Event Listing",
  description: "Discover and create events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900  antialiased">
        <StoreProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
