import { SkeletonDesigner } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <section className="section-padding">
        <div className="container">
          {/* Header Skeleton */}
          <div className="mb-12 space-y-4">
            <div className="h-12 w-48 bg-zinc-800/50 animate-pulse rounded" />
            <div className="h-6 w-96 bg-zinc-800/50 animate-pulse rounded" />
          </div>

          {/* Designers Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonDesigner key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}