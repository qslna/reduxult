import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <section className="section-padding">
        <div className="container">
          {/* Header Skeleton */}
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-12 w-48 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Timeline Skeleton */}
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800" />
            
            <div className="space-y-16">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center ${
                    i % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className={`w-5/12 ${i % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <Skeleton className="h-64 w-full mb-4" />
                    <Skeleton className="h-8 w-3/4 ml-auto mb-2" />
                    <Skeleton className="h-6 w-1/2 ml-auto mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6 ml-auto" />
                    </div>
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