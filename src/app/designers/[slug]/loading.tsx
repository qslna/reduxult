import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section Skeleton */}
      <section className="relative h-[70vh] bg-zinc-900">
        <Skeleton className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container">
            <Skeleton className="h-16 w-64 mb-4" />
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          {/* Bio Section Skeleton */}
          <div className="max-w-4xl mx-auto mb-20">
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-6 w-4/5" />
            </div>
          </div>

          {/* Portfolio Section Skeleton */}
          <div>
            <Skeleton className="h-10 w-32 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}