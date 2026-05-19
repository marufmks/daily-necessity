import { cn } from "@/lib/utils";

export function Loader({ className }) {
  return (
    <div className={cn("flex items-center justify-center py-20", className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
