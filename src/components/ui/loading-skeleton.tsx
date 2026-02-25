export function PairSkeleton() {
  return (
    <div className="card-base p-3 space-y-2">
      <div className="flex justify-between">
        <div className="space-y-1">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-3 w-12" />
        </div>
        <div className="space-y-1 text-right">
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-3 w-10" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-14" />
        <div className="skeleton h-3 w-12" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="card-base p-4 space-y-1">
      <div className="skeleton h-3 w-16" />
      <div className="skeleton h-8 w-28" />
      <div className="skeleton h-3 w-12" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="space-y-1">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-3 w-16" />
      </div>
      <div className="text-right space-y-1">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-10" />
      </div>
    </div>
  );
}
