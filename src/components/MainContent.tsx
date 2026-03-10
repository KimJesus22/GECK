"use client";

import { usePathname } from "next/navigation";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${
        isLogin ? "" : "ml-[260px]"
      }`}
    >
      {children}
    </main>
  );
}
