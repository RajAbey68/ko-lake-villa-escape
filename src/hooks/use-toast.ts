// Simplified toast hook that bridges to Sonner to avoid provider conflicts
import { toast as sonnerToast } from "@/components/ui/sonner";

export type ToastOptions = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

function useToast() {
  const toast = (opts: ToastOptions) => {
    const title = opts?.title ?? (opts?.variant === "destructive" ? "Error" : "Notice");
    sonnerToast(title, { description: opts?.description });
  };

  return {
    toasts: [],
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast, sonnerToast as toast };
