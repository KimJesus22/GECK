"use client";

import { useEffect } from "react";
import { X, FileText, FileType, FileVideo, Terminal } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  type: "pdf" | "word" | "video" | string;
}

export default function DocumentViewerModal({ isOpen, onClose, url, title, type }: ModalProps) {
  // Bloquear el scroll del fondo cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Manejar tecla ESC para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !url || url === "#") return null;

  const Icon = type === "pdf" ? FileText : type === "video" ? FileVideo : FileType;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* Backdrop con desenfoque */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Ventana Modal "Geek-Chic" */}
      <div 
        className="relative flex w-full max-w-6xl flex-col border border-phosphor/20 bg-terminal-900 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {/* Cabecera Tipo Terminal */}
        <div className="flex shrink-0 items-center justify-between border-b border-phosphor/10 bg-terminal-800 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-2 border border-phosphor/10 bg-terminal-900 px-2 py-1">
              <Icon className="h-4 w-4 text-phosphor" />
              <span className="font-mono text-[10px] tracking-widest text-softgreen uppercase">
                {type}
              </span>
            </div>
            
            {/* Título truncado para q no rompa el diseño */}
            <h3 className="truncate font-mono text-sm tracking-wide text-softgreen sm:text-base">
              {title}
            </h3>
          </div>

          <div className="ml-4 flex items-center gap-4">
            <div className="hidden items-center gap-1.5 sm:flex">
              <div className="h-2 w-2 rounded-full bg-red-500/80" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/80" />
              <div className="h-2 w-2 rounded-full bg-green-500/80" />
            </div>

            {/* Botón de Cierre */}
            <button
              onClick={onClose}
              className="group flex items-center gap-2 border border-phosphor/20 bg-terminal-900 px-3 py-1.5 transition-all
                         hover:border-purple-accent/40 hover:bg-purple-accent/10 hover:text-purple-accent"
              title="Cerrar Terminal (ESC)"
            >
              <span className="hidden font-mono text-xs tracking-wider text-softgreen-dim group-hover:text-purple-accent sm:inline">
                Cerrar Terminal
              </span>
              <X className="h-4 w-4 text-softgreen-dim group-hover:text-purple-accent" />
            </button>
          </div>
        </div>

        {/* Contenido (Visor Iframe / Video) */}
        <div className="relative flex-1 bg-black/50 p-2 sm:p-4">
          {type === "video" ? (
            <video
              src={url}
              controls
              autoPlay
              className="h-full w-full object-contain focus:outline-none"
            >
              Tu navegador no soporta la etiqueta de video.
            </video>
          ) : (
            <iframe
              src={type === "word" ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}` : url}
              className="h-full w-full border-none bg-white rounded-sm"
              title={`Visor de documento: ${title}`}
            />
          )}
        </div>
        
        {/* Footer simple (opcional) */}
        <div className="shrink-0 border-t border-phosphor/10 bg-terminal-800 px-4 py-2 font-mono text-[10px] text-softgreen-dim/40 tracking-widest flex items-center gap-2">
            <Terminal className="w-3 h-3 text-phosphor/40" />
            <span>INGENIA_BASE // SECURE_VIEWER_V1</span>
        </div>
      </div>
    </div>
  );
}
