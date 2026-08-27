"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
export default function BootstrapClient() {
  useEffect(() => { require("bootstrap/dist/js/bootstrap.bundle.min.js"); }, []);
  useEffect(() => { useAuthStore.getState().loadFromStorage(); }, []);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.error("SW registration failed", err);
        });
      });
    }
  }, []);
  return null;
}
