import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ size = "md", className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

interface LoadingStateProps {
  children: React.ReactNode;
  isLoading: boolean;
  error?: Error | null;
  loadingText?: string;
  errorText?: string;
  retryButton?: boolean;
  onRetry?: () => void;
  className?: string;
}

export const LoadingState = ({
  children,
  isLoading,
  error,
  loadingText = "Loading...",
  errorText = "Something went wrong. Please try again.",
  retryButton = true,
  onRetry,
  className
}: LoadingStateProps) => {
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <LoadingSpinner text={loadingText} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 space-y-4", className)}>
        <p className="text-destructive text-center">{errorText}</p>
        {retryButton && onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};