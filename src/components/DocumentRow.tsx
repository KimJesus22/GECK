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
      {/* Desktop row (hidden on mobile) */}
      <tr
        className="group hidden border-b border-phosphor/8 transition-all duration-200
                   hover:bg-terminal-600/50 md:table-row"
        style={{ animation: `fade-in-up 0.4s ease-out ${delay}ms both` }}
      >
        {/* File type icon */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-phosphor/20 bg-terminal-800">
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-softgreen-dim/60 uppercase">
              {config.label}
            </span>
          </div>
        </td>

        {/* Document name */}
        <td className="px-4 py-4">
          <span className="font-mono text-sm font-medium tracking-wide text-softgreen transition-colors group-hover:text-purple-accent-bright">
            {name}
          </span>
        </td>

        {/* Description */}
        <td className="hidden px-4 py-4 lg:table-cell">
          <span className="text-sm leading-relaxed text-softgreen-dim/70">
            {description}
          </span>
        </td>

        {/* Size */}
        <td className="hidden px-4 py-4 xl:table-cell">
          <span className="font-mono text-xs text-softgreen-dim/50">{size}</span>
        </td>

        {/* Date */}
        <td className="hidden px-4 py-4 xl:table-cell">
          <span className="font-mono text-xs text-softgreen-dim/50">{date}</span>
        </td>

        {/* Actions */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction("Visualizó documento en modal")}
              className={`flex items-center gap-1.5 border border-purple-accent/30 bg-transparent
                         px-3 py-1.5 font-mono text-xs tracking-wider text-purple-accent
                         transition-all duration-200
                         hover:bg-purple-accent hover:text-terminal-900 hover:shadow-[0_0_16px_rgba(196,167,231,0.25)]
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
              className={`flex items-center gap-1.5 border border-phosphor/20 bg-transparent
                         px-3 py-1.5 font-mono text-xs tracking-wider text-softgreen-dim
                         transition-all duration-200
                         hover:border-purple-accent/40 hover:bg-purple-glow hover:text-purple-accent
                         ${!fileUrl ? "opacity-40 pointer-events-none" : ""}`}
            >
              <Download className="h-3.5 w-3.5" />
              Descargar
            </a>
          </div>
        </td>
      </tr>

      {/* Mobile card (hidden on desktop) */}
      <tr
        className="md:hidden"
        style={{ animation: `fade-in-up 0.4s ease-out ${delay}ms both` }}
      >
        <td colSpan={6} className="p-0 pb-3">
          <div className="border border-phosphor/15 bg-terminal-700 p-4">
            {/* Top: icon + name + badge */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-phosphor/20 bg-terminal-800">
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-medium tracking-wide text-softgreen truncate">
                    {name}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-softgreen-dim/50 uppercase shrink-0">
                    {config.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-softgreen-dim/70">
                  {description}
                </p>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-4 mb-3 text-softgreen-dim/40 font-mono text-[10px] tracking-wider">
              <span>{size}</span>
              <span>{date}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction("Visualizó documento en modal")}
                className={`flex flex-1 items-center justify-center gap-1.5 border border-purple-accent/30
                           px-3 py-2 font-mono text-xs tracking-wider text-purple-accent
                           transition-all duration-200
                           hover:bg-purple-accent hover:text-terminal-900 hover:shadow-[0_0_16px_rgba(196,167,231,0.25)]
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
                className={`flex flex-1 items-center justify-center gap-1.5 border border-phosphor/20
                           px-3 py-2 font-mono text-xs tracking-wider text-softgreen-dim
                           transition-all duration-200
                           hover:border-purple-accent/40 hover:bg-purple-glow hover:text-purple-accent
                           ${!fileUrl ? "opacity-40 pointer-events-none" : ""}`}
              >
                <Download className="h-3.5 w-3.5" />
                Descargar
              </a>
            </div>
          </div>
        </td>
      </tr>

      {/* Modal Visor Componente P/ DocumentRow */}
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
