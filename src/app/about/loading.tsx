import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section Skeleton */}
      <section className="relative h-[60vh] bg-zinc-900">
        <Skeleton className="absolute inset-0" />
      </section>

      {/* Content Section Skeleton */}
      <section className="section-padding">
        <div className="container">
          {/* Story Section Skeleton */}
          <div className="max-w-4xl mx-auto mb-20">
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>

          {/* Categories Grid Skeleton */}
          <div className="mb-12">
            <Skeleton className="h-10 w-40 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-8 space-y-3">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}