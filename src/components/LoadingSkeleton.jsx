export default function LoadingSkeleton({ type = 'grid', count = 12 }) {
  if (type === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] bg-[#1a1a1a] rounded-lg" />
            <div className="mt-2 h-4 bg-[#1a1a1a] rounded w-3/4" />
            <div className="mt-1 h-3 bg-[#1a1a1a] rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse p-6 flex gap-6">
        <div className="w-64 aspect-[2/3] bg-[#1a1a1a] rounded-lg shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-[#1a1a1a] rounded w-3/4" />
          <div className="h-4 bg-[#1a1a1a] rounded w-1/2" />
          <div className="h-20 bg-[#1a1a1a] rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
