export default function PortfolioLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="w-32 h-7 bg-white/[0.06] rounded-lg mb-2" />
        <div className="w-72 h-3 bg-white/[0.04] rounded" />
      </div>

      {/* Total value skeleton */}
      <div className="glass rounded-2xl p-6 mb-5">
        <div className="w-36 h-3 bg-white/[0.04] rounded mb-2" />
        <div className="w-48 h-10 bg-white/[0.06] rounded mb-2" />
        <div className="w-32 h-4 bg-white/[0.04] rounded" />
      </div>

      {/* Allocation skeleton */}
      <div className="glass rounded-2xl p-6 mb-5">
        <div className="w-28 h-4 bg-white/[0.06] rounded mb-4" />
        <div className="w-full h-3 bg-white/[0.04] rounded-full mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-xl p-3">
              <div className="w-2 h-2 bg-white/[0.04] rounded-full mb-2" />
              <div className="w-20 h-4 bg-white/[0.06] rounded mb-1" />
              <div className="w-16 h-2.5 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Holdings list skeleton */}
      <div className="glass rounded-2xl p-6">
        <div className="w-24 h-4 bg-white/[0.06] rounded mb-5" />
        <div className="space-y-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/[0.04] rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <div className="w-14 h-3 bg-white/[0.06] rounded" />
                  <div className="w-20 h-3 bg-white/[0.06] rounded" />
                </div>
                <div className="flex justify-between mb-2">
                  <div className="w-32 h-2.5 bg-white/[0.04] rounded" />
                  <div className="w-12 h-2.5 bg-white/[0.04] rounded" />
                </div>
                <div className="w-full h-1 bg-white/[0.04] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
