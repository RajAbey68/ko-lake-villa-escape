interface AmenityBadgeProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export function AmenityBadge({ icon: Icon, label }: AmenityBadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}