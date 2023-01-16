export default function TokenSkeleton({ width = '20' }: { width: string} ) {
  return (
    <div className="animate-pulse" style={{ width: `${width}%` }}>
      <div className={`h-5 w-${width} bg-slate-400 rounded`}></div>
    </div>
  );
}