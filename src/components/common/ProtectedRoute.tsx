"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const router = useRouter();
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }
  if (!isAdmin) {
    router.push("/delivery/restaurants");
    return null;
  }
  return <>{children}</>;
}
