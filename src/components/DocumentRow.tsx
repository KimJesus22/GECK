"use client";

import { useState } from "react";
import {
  FileText,
  FileVideo,
  FileType,
  Eye,
  Download,
  type LucideIcon,
} from "lucide-react";
import { logAuditAction } from "@/lib/audit";
import DocumentViewerModal from "@/components/DocumentViewerModal";

const fileTypeConfig: Record<string, { icon: LucideIcon; label: string; color: string }> = {
  pdf: { icon: FileText, label: "PDF", color: "text-red-400" },
  word: { icon: FileType, label: "DOCX", color: "text-blue-400" },
  video: { icon: FileVideo, label: "VIDEO", color: "text-yellow-400" },
};

interface DocumentRowProps {
  id?: string;
  name: string;
  description: string;
  fileType: "pdf" | "word" | "video";
  size: string;
  date: string;
  url?: string;
  delay?: number;
}

export default function DocumentRow({
  id,
  name,
  description,
  fileType,
  size,
  date,
  url,
  delay = 0,
}: DocumentRowProps) {
  const config = fileTypeConfig[fileType];
  const Icon = config.icon;
  const fileUrl = url && url !== "#" ? url : null;
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleAction = (accion: string) => {
    if (id && fileUrl) {
      logAuditAction(accion, id, { titulo: name, archivo: fileType });
      if (accion === "Visualizó documento en modal") {
         setIsViewerOpen(true);
      }
    }
  };

  return (
    <>
      {/* Desktop row */}
      <tr
        className="group hidden border-b border-surface-600/15 transition-all duration-200
                   hover:bg-surface-700/30 md:table-row"
        style={{ animation: `fade-in-up 0.4s ease-out ${delay}ms both` }}
      >
        {/* File type icon */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-surface-600/30 bg-surface-800">
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <span className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">
              {config.label}
            </span>
          </div>
        </td>

        {/* Document name */}
        <td className="px-4 py-4">
          <span className="text-sm font-medium text-text-primary transition-colors group-hover:text-indigo">
            {name}
          </span>
        </td>

        {/* Description */}
        <td className="hidden px-4 py-4 lg:table-cell">
          <span className="text-sm leading-relaxed text-text-muted">
            {description}
          </span>
        </td>

        {/* Size */}
        <td className="hidden px-4 py-4 xl:table-cell">
          <span className="text-xs font-medium text-text-muted">{size}</span>
        </td>

        {/* Date */}
        <td className="hidden px-4 py-4 xl:table-cell">
          <span className="text-xs font-medium text-text-muted">{date}</span>
        </td>

        {/* Actions */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction("Visualizó documento en modal")}
              className={`flex items-center gap-1.5 rounded-lg border border-indigo/30 bg-indigo/5
                         px-3 py-1.5 text-xs font-medium text-indigo
                         transition-all duration-200
                         hover:bg-indigo hover:text-white hover:shadow-md hover:shadow-indigo/20
                         ${!fileUrl ? "opacity-40 pointer-events-none" : ""}`}
            >
              <Eye className="h-3.5 w-3.5" />
              Leer
            </button>
            <a
              href={fileUrl || "#"}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleAction("Descargó documento")}
              className={`flex items-center gap-1.5 rounded-lg border border-surface-600/30
                         px-3 py-1.5 text-xs font-medium text-text-secondary
                         transition-all duration-200
                         hover:border-indigo/30 hover:bg-indigo/5 hover:text-indigo
                         ${!fileUrl ? "opacity-40 pointer-events-none" : ""}`}
            >
              <Download className="h-3.5 w-3.5" />
              Descargar
            </a>
          </div>
        </td>
      </tr>

      {/* Mobile card */}
      <tr
        className="md:hidden"
        style={{ animation: `fade-in-up 0.4s ease-out ${delay}ms both` }}
      >
        <td colSpan={6} className="p-0 pb-3">
          <div className="rounded-xl border border-surface-600/20 bg-surface-800 p-4">
            {/* Top */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-surface-600/30 bg-surface-900">
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {name}
                  </span>
                  <span className="text-[10px] font-semibold tracking-widest text-text-muted uppercase shrink-0">
                    {config.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-text-muted">
                  {description}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-3 text-text-muted text-[10px] font-medium tracking-wider">
              <span>{size}</span>
              <span>{date}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction("Visualizó documento en modal")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-indigo/30
                           px-3 py-2 text-xs font-medium text-indigo
                           transition-all duration-200
                           hover:bg-indigo hover:text-white hover:shadow-md hover:shadow-indigo/20
                           ${!fileUrl ? "opacity-40 pointer-events-none" : ""}`}
              >
                <Eye className="h-3.5 w-3.5" />
                Leer
              </button>
              <a
                href={fileUrl || "#"}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleAction("Descargó documento")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-surface-600/30
                           px-3 py-2 text-xs font-medium text-text-secondary
                           transition-all duration-200
                           hover:border-indigo/30 hover:bg-indigo/5 hover:text-indigo
                           ${!fileUrl ? "opacity-40 pointer-events-none" : ""}`}
              >
                <Download className="h-3.5 w-3.5" />
                Descargar
              </a>
            </div>
          </div>
        </td>
      </tr>

      <DocumentViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        url={fileUrl || ""}
        title={name}
        type={fileType}
      />
    </>
  );
}
