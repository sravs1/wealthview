export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-pulse">
      {/* Welcome skeleton */}
      <div className="mb-8">
        <div className="w-52 h-7 bg-white/[0.06] rounded-lg mb-2" />
        <div className="w-64 h-3 bg-white/[0.04] rounded" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5">
            <div className="w-9 h-9 bg-white/[0.04] rounded-xl mb-3" />
            <div className="w-32 h-7 bg-white/[0.06] rounded mb-1" />
            <div className="w-24 h-3 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>

      {/* Holdings skeleton */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex justify-between mb-5">
          <div className="w-28 h-4 bg-white/[0.06] rounded" />
          <div className="w-16 h-3 bg-white/[0.04] rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-9 h-9 bg-white/[0.04] rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <div className="w-16 h-3 bg-white/[0.06] rounded" />
                  <div className="w-20 h-3 bg-white/[0.06] rounded" />
                </div>
                <div className="w-36 h-2.5 bg-white/[0.04] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
