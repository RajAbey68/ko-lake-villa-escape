export function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 right-8 z-30">
      <div className="animate-bounce text-white/80">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}