"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Shield, ShieldAlert, CheckCircle2, Ban, MoreVertical, Edit2 } from "lucide-react";
import { Perfil } from "@/lib/types";
import { actualizarRolUsuario, actualizarEstadoUsuario } from "@/lib/admin-actions";

export default function ClientUserTable({ 
  initialUsuarios, 
  currentUserId 
}: { 
  initialUsuarios: Perfil[];
  currentUserId: string;
}) {
  const [usuarios, setUsuarios] = useState<Perfil[]>(initialUsuarios);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleRol = async (user: Perfil) => {
    if (user.id === currentUserId) {
      toast.error("No puedes cambiar tu propio rol.");
      return;
    }
    
    setLoadingId(user.id);
    const nuevoRol = user.rol === "admin" ? "evaluador" : "admin";
    
    try {
      await actualizarRolUsuario(user.id, nuevoRol);
      setUsuarios(usuarios.map(u => u.id === user.id ? { ...u, rol: nuevoRol } : u));
      toast.success(`Rol cambiado a ${nuevoRol.toUpperCase()} para ${user.correo}`);
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar rol");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleEstado = async (user: Perfil) => {
    if (user.id === currentUserId) {
      toast.error("No puedes desactivar tu propia cuenta.");
      return;
    }

    setLoadingId(user.id);
    const nuevoEstado = user.estado === "activo" ? "inactivo" : "activo";
    
    try {
      await actualizarEstadoUsuario(user.id, nuevoEstado);
      setUsuarios(usuarios.map(u => u.id === user.id ? { ...u, estado: nuevoEstado } : u));
      toast.success(`La cuenta de ${user.correo} ahora está ${nuevoEstado.toUpperCase()}`);
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar estado");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-surface-600/30 bg-surface-800/30 text-xs font-semibold tracking-wider text-text-muted uppercase">
          <tr>
            <th className="px-6 py-4">Usuario (Correo)</th>
            <th className="px-6 py-4">Rol</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4">Fecha de Registro</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-600/20">
          {usuarios.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-surface-800/30">
              <td className="px-6 py-4 font-medium text-text-primary">
                {user.correo || "Sin correo"}
                {user.id === currentUserId && (
                  <span className="ml-2 rounded bg-indigo/10 px-1.5 py-0.5 text-[10px] font-bold text-indigo uppercase">
                    Tú
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold border ${
                  user.rol === "admin" 
                    ? "border-indigo/30 bg-indigo/10 text-indigo"
                    : "border-surface-600/50 bg-surface-700 text-text-secondary"
                }`}>
                  {user.rol === "admin" ? <Shield className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                  {user.rol.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold border ${
                  user.estado === "activo"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}>
                  {user.estado === "activo" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                  {user.estado.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 text-text-secondary">
                {format(new Date(user.created_at), "dd MMM yyyy", { locale: es })}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleRol(user)}
                    disabled={loadingId === user.id || user.id === currentUserId}
                    className="flex min-h-[36px] items-center justify-center rounded-lg border border-surface-600/50 bg-surface-800 px-3 py-1 text-xs font-semibold text-text-secondary transition-colors hover:border-indigo/50 hover:bg-indigo/10 hover:text-indigo disabled:opacity-50"
                  >
                    Hacer {user.rol === "admin" ? "Evaluador" : "Admin"}
                  </button>
                  <button
                    onClick={() => handleToggleEstado(user)}
                    disabled={loadingId === user.id || user.id === currentUserId}
                    className={`flex min-h-[36px] items-center justify-center rounded-lg border px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                      user.estado === "activo"
                        ? "border-red-500/20 bg-red-500/5 text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
                        : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                    }`}
                  >
                    {user.estado === "activo" ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {usuarios.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
