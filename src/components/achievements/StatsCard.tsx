interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export function StatsCard({ icon, label, value }: StatsCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/20 transition-colors duration-300">
      <div className="flex items-center space-x-2 mb-1">
        {icon}
        <span className="text-xs font-medium text-blue-100">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
