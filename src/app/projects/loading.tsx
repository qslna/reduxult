import { SkeletonProject } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <section className="section-padding">
        <div className="container">
          {/* Header Skeleton */}
          <div className="mb-12 space-y-4">
            <div className="h-12 w-32 bg-zinc-800/50 animate-pulse rounded" />
            <div className="h-6 w-80 bg-zinc-800/50 animate-pulse rounded" />
          </div>

          {/* Filters Skeleton */}
          <div className="flex flex-wrap gap-3 mb-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-zinc-800/50 animate-pulse rounded-full" />
            ))}
          </div>

          {/* Projects Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonProject key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}