// Shared reusable loading / auth states for dashboard pages
export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
      {message}
    </div>
  );
}
