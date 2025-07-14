import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/utils/constants';

export default function AboutPreview() {
  const categoryList = Object.values(CATEGORIES);

  return (
    <section className="section-padding bg-zinc-900">
      <div className="container">
        <div className="mb-12">
          <h2 className="heading-2 mb-4">About REDUX</h2>
          <p className="body-large text-gray-400 max-w-3xl">
            REDUX는 6인의 디자이너로 구성된 패션과 예술의 창작 집단입니다. 
            우리는 전통과 혁신, 개인과 집단, 예술과 상업의 경계를 넘나들며 
            새로운 창작의 가능성을 탐구합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryList.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              href={`/projects?category=${category.id}`}
              className="group block p-6 bg-black/50 border border-white/10 rounded-lg hover:border-white/30 transition-all"
            >
              <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-300 transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-gray-500 mb-1">{category.titleKo}</p>
              <p className="text-gray-400 mt-3 line-clamp-2">
                {category.description}
              </p>
              <div className="mt-4 flex items-center text-sm text-gray-500 group-hover:text-white transition-colors">
                <span>자세히 보기</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            <span>Explore More</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}