import { Nav } from "./Nav";

import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <main className={`h-[calc(100vh-48px)]`}>
      <Nav />
      {children}
    </main>
  );
}
