"use client";

import { usePathname } from "next/navigation";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/" || pathname === "/login";

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${
        isLogin ? "" : "md:ml-[260px] pt-14 md:pt-0"
      }`}
    >
      {children}
    </main>
  );
}
