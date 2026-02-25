export default function InsightsLoading() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-pulse">
      <div className="mb-8">
        <div className="w-32 h-7 bg-white/[0.06] rounded-lg mb-2" />
        <div className="w-64 h-3 bg-white/[0.04] rounded" />
      </div>

      <div className="glass rounded-2xl p-12 text-center border border-white/[0.05]">
        <div className="w-14 h-14 bg-white/[0.04] rounded-2xl mx-auto mb-5" />
        <div className="w-52 h-5 bg-white/[0.06] rounded mx-auto mb-3" />
        <div className="w-80 h-3 bg-white/[0.04] rounded mx-auto mb-2" />
        <div className="w-64 h-3 bg-white/[0.04] rounded mx-auto mb-8" />
        <div className="w-44 h-11 bg-white/[0.04] rounded-xl mx-auto" />
      </div>
    </div>
  );
}
