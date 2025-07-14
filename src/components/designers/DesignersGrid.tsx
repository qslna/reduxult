import Link from 'next/link';
import Image from 'next/image';
import { DESIGNERS } from '@/utils/constants';
import { Instagram } from 'lucide-react';

export default function DesignersGrid() {
  return (
    <section className="section-padding">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESIGNERS.map((designer) => (
            <Link
              key={designer.id}
              href={`/designers/${designer.id}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900 mb-6">
                <Image
                  src={designer.profileImage}
                  alt={designer.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h2 className="text-2xl font-semibold mb-1 group-hover:text-gray-300 transition-colors">
                {designer.name}
              </h2>
              <p className="text-gray-500 mb-1">{designer.nameKo}</p>
              <p className="text-gray-400 mb-3">{designer.role}</p>
              <p className="text-gray-500 line-clamp-2 mb-4">
                {designer.bio}
              </p>
              
              <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                <Instagram size={16} className="mr-2" />
                @{designer.instagramHandle}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}