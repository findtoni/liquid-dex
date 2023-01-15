export default function TokenSkeleton({ width = '20' }: { width: string} ) {
  return (
    <div className="animate-pulse">
      <div className={`h-4 w-${width} bg-slate-400 rounded`}></div>
    </div>
  );
}