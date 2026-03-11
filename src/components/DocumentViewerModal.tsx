"use client";

import { useEffect } from "react";
import { X, FileText, FileType, FileVideo, LayoutDashboard } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  type: "pdf" | "word" | "video" | string;
}

export default function DocumentViewerModal({ isOpen, onClose, url, title, type }: ModalProps) {
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
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="relative flex w-full max-w-6xl flex-col rounded-2xl border border-surface-600/40 bg-surface-950 shadow-2xl shadow-black/40"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-surface-600/30 bg-surface-900 px-4 py-3 sm:px-6 rounded-t-2xl">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-2 rounded-lg border border-surface-600/30 bg-surface-800 px-2.5 py-1.5">
              <Icon className="h-4 w-4 text-accent" />
              <span className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">
                {type}
              </span>
            </div>
            
            <h3 className="truncate text-sm font-semibold tracking-wide text-text-primary sm:text-base">
              {title}
            </h3>
          </div>

          <div className="ml-4 flex items-center gap-4">
            <div className="hidden items-center gap-1.5 sm:flex">
              <div className="h-2 w-2 rounded-full bg-red-500/60" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
              <div className="h-2 w-2 rounded-full bg-green-500/60" />
            </div>

            <button
              onClick={onClose}
              className="group flex items-center gap-2 rounded-lg border border-surface-600/30 bg-surface-800 px-3 py-1.5 transition-all
                         hover:border-indigo/30 hover:bg-indigo/10 hover:text-indigo"
              title="Cerrar (ESC)"
            >
              <span className="hidden text-xs font-medium text-text-muted group-hover:text-indigo sm:inline">
                Cerrar
              </span>
              <X className="h-4 w-4 text-text-muted group-hover:text-indigo" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 bg-black/20 p-2 sm:p-3">
          {type === "video" ? (
            <video
              src={url}
              controls
              autoPlay
              className="h-full w-full rounded-lg object-contain focus:outline-none"
            >
              Tu navegador no soporta la etiqueta de video.
            </video>
          ) : (
            <iframe
              src={type === "word" ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}` : url}
              className="h-full w-full rounded-lg border-none bg-white"
              title={`Visor de documento: ${title}`}
            />
          )}
        </div>
        
        {/* Footer */}
        <div className="shrink-0 border-t border-surface-600/30 bg-surface-900 px-4 py-2 text-[10px] text-text-muted/40 tracking-widest flex items-center gap-2 rounded-b-2xl">
            <LayoutDashboard className="w-3 h-3 text-accent/40" />
            <span>INGENIA BASE — Visor Seguro</span>
        </div>
      </div>
    </div>
  );
}
