"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
export default function BootstrapClient() {
  useEffect(() => { require("bootstrap/dist/js/bootstrap.bundle.min.js"); }, []);
  useEffect(() => { useAuthStore.getState().loadFromStorage(); }, []);
  return null;
}
