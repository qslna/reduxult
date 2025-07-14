import Link from 'next/link';
import Image from 'next/image';
import { DESIGNERS } from '@/utils/constants';
import { Instagram } from 'lucide-react';

export default function DesignersPreview() {
  const featuredDesigners = DESIGNERS.filter(d => d.featured).slice(0, 3);

  return (
    <section className="section-padding">
      <div className="container">
        <div className="mb-12">
          <h2 className="heading-2 mb-4">Designers</h2>
          <p className="body-large text-gray-400">
            창의성과 열정으로 가득한 6인의 디자이너를 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDesigners.map((designer) => (
            <Link
              key={designer.id}
              href={`/designers/${designer.id}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900 mb-4">
                <Image
                  src={designer.profileImage}
                  alt={designer.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-semibold mb-1 group-hover:text-gray-300 transition-colors">
                {designer.name}
              </h3>
              <p className="text-sm text-gray-500 mb-1">{designer.nameKo}</p>
              <p className="text-sm text-gray-400 mb-3">{designer.role}</p>
              <div className="flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                <Instagram size={16} className="mr-2" />
                @{designer.instagramHandle}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/designers"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-medium rounded-md hover:bg-white hover:text-black transition-all"
          >
            View All Designers
          </Link>
        </div>
      </div>
    </section>
  );
}