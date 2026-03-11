"use client";

import React, { useEffect } from "react";

export default function AxeCoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Solo se ejecuta en desarrollo y en el navegador
    if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
      Promise.all([
        import("react"),
        import("react-dom"),
        import("@axe-core/react"),
      ]).then(([react, reactDOM, axe]) => {
        // Ejecuta axe con delay de 1000ms para permitir renderizado completo
        axe.default(react.default, reactDOM.default, 1000, {});
      });
    }
  }, []);

  return <>{children}</>;
}
