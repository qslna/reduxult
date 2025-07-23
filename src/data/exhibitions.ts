import { Exhibition } from '@/types';

export const exhibitions: Exhibition[] = [
  {
    id: 'cine-mode',
    title: 'CINE MODE',
    titleKo: '시네 모드',
    description: 'A cinematic exploration of fashion through the lens of contemporary filmmaking. Six designers present their vision through moving images and installations.',
    venue: 'Seoul Art Center',
    startDate: '2025-03-01',
    endDate: '2025-03-31',
    year: 2025,
    participants: ['kim-bomin', 'park-parang', 'lee-taehyeon', 'choi-eunsol', 'hwang-jinsu', 'kim-gyeongsu'],
    images: [
      '/images/exhibitions/cinemode/1.jpg',
      '/images/exhibitions/cinemode/2.jpg',
      '/images/exhibitions/cinemode/3.jpg',
      '/images/exhibitions/cinemode/4.jpg'
    ],
    status: 'upcoming',
    featured: true
  },
  {
    id: 'the-room',
    title: 'THE ROOM OF [ ]',
    titleKo: '더 룸 오브 [ ]',
    description: 'An immersive installation exploring the concept of empty spaces and infinite possibilities in fashion design.',
    venue: 'DDP (Dongdaemun Design Plaza)',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    year: 2025,
    participants: ['kim-bomin', 'park-parang', 'lee-taehyeon', 'choi-eunsol', 'hwang-jinsu', 'kim-gyeongsu'],
    images: [
      '/images/exhibitions/theroom/1.jpg',
      '/images/exhibitions/theroom/2.jpg',
      '/images/exhibitions/theroom/3.jpg'
    ],
    status: 'upcoming',
    featured: true
  }
];