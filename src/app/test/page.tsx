'use client';

import { useState } from 'react';
import StackGallery from '@/components/StackGallery';
import Navigation from '@/components/Navigation';

export default function TestPage() {
  const [images1, setImages1] = useState([
    { id: '1', src: '/images/designer-placeholder.jpg', alt: 'Test 1' },
    { id: '2', src: '/images/designer-placeholder.jpg', alt: 'Test 2' },
    { id: '3', src: '/images/designer-placeholder.jpg', alt: 'Test 3' },
    { id: '4', src: '/images/designer-placeholder.jpg', alt: 'Test 4' },
    { id: '5', src: '/images/designer-placeholder.jpg', alt: 'Test 5' }
  ]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 px-8">
        <h1 className="text-4xl mb-8">Stack Gallery Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div>
            <h2 className="text-xl mb-4">Gallery 1</h2>
            <StackGallery
              images={images1}
              folder="test/gallery1"
              className="w-full"
              maxVisible={3}
              onImagesUpdate={setImages1}
            />
          </div>
          
          <div>
            <h2 className="text-xl mb-4">Gallery 2</h2>
            <StackGallery
              images={[
                { id: '1', src: '/images/designer-placeholder.jpg', alt: 'Gallery 2-1' },
                { id: '2', src: '/images/designer-placeholder.jpg', alt: 'Gallery 2-2' },
                { id: '3', src: '/images/designer-placeholder.jpg', alt: 'Gallery 2-3' }
              ]}
              folder="test/gallery2"
              className="w-full"
              maxVisible={3}
            />
          </div>
          
          <div>
            <h2 className="text-xl mb-4">Gallery 3 (Empty)</h2>
            <StackGallery
              images={[]}
              folder="test/gallery3"
              className="w-full"
              maxVisible={3}
            />
          </div>
        </div>
        
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl mb-4">테스트 안내</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>마우스를 올리면 스택 효과가 나타납니다</li>
            <li>관리자 모드에서는 + 버튼으로 이미지를 추가할 수 있습니다</li>
            <li>각 이미지의 × 버튼으로 삭제할 수 있습니다</li>
            <li>Gallery 1은 5개 이미지 중 3개만 표시되고 +2 표시가 나타납니다</li>
            <li>Gallery 3은 비어있는 상태로 시작합니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}