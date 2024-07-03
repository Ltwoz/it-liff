export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-400" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-800" />
      </div>
    </div>
  );
}
