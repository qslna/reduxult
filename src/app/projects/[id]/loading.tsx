import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <section className="section-padding">
      <div className="container">
        {/* Back Button Skeleton */}
        <Skeleton className="h-6 w-32 mb-12" />

        {/* Project Header Skeleton */}
        <div className="mb-16 space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-8 w-1/2" />
          <div className="flex items-center gap-6 mt-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>

        {/* Main Image Skeleton */}
        <Skeleton className="aspect-[16/9] w-full mb-16" />

        {/* Description Skeleton */}
        <div className="max-w-4xl mx-auto mb-20">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
          </div>
        </div>

        {/* Gallery Skeleton */}
        <div>
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] w-full" />
            ))}
          </div>
        </div>

        {/* Designers Section Skeleton */}
        <div className="mt-20">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-6 bg-white/5 rounded-lg">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}