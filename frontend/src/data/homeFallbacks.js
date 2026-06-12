import cleanupImg from '../assets/landing/news-cleanup.png';
import poetryImg from '../assets/landing/news-poetry.png';
import workshopImg from '../assets/landing/news-workshop.png';

export const fallbackSocieties = [
  {
    _id: 'fallback-literary',
    isFallback: true,
    name: 'Namal Literary & Debating Society (LDS)',
    shortName: 'Literary & Debating',
    categoryLabel: 'Literary Pillar',
    description: 'A forum for critical inquiry, debate, poetry recitations, and literary evenings at Namal, keeping academic discourse and creative expression active.',
    estYear: '2010',
    number: '01'
  },
  {
    _id: 'fallback-computing',
    isFallback: true,
    name: 'Namal Computing Society (NCS)',
    shortName: 'Computing Society',
    categoryLabel: 'Technology Pillar',
    description: 'Drives competitive coding championships, technical programming sprints, and neural network workshops.',
    estYear: '2010',
    number: '02'
  },
  {
    _id: 'fallback-media',
    isFallback: true,
    name: 'Namal Media Club (VoN)',
    shortName: 'Media Club',
    categoryLabel: 'Media Pillar',
    description: 'Captures and logs all university events, providing digital photography courses and editing news for the community.',
    estYear: '2016',
    number: '03'
  },
  {
    _id: 'fallback-sports',
    isFallback: true,
    name: 'Namal Sports & Wellness Society',
    shortName: 'Sports & Wellness',
    categoryLabel: 'Sports Pillar',
    description: 'Promotes fitness, sportsmanship, and wellness through intra-society tournaments and training programs.',
    estYear: '2012',
    number: '05'
  }
];

export const fallbackEvents = [
  {
    _id: 'fallback-debate',
    isFallback: true,
    title: 'Intra-Society Debate Championship',
    location: 'Namal Auditorium',
    startDateTime: '2025-06-24T10:00:00+05:00',
    endDateTime: '2025-06-24T16:00:00+05:00',
    description: 'Top speakers from across Namal societies compete in a day of ideas, argument, and leadership.',
    category: 'FEATURED EVENT',
    status: 'approved'
  },
  {
    _id: 'fallback-clean-up',
    isFallback: true,
    title: 'Namal Clean-Up Drive',
    location: 'Namal Lake',
    startDateTime: '2025-06-18T09:00:00+05:00',
    description: 'Students from multiple societies joined hands to clean and green key areas around campus and the lake.',
    category: 'EVENTS',
    status: 'approved'
  },
  {
    _id: 'fallback-neural',
    isFallback: true,
    title: 'NCS Workshop on Neural Networks',
    location: 'Huawei Lab',
    startDateTime: '2025-06-12T14:30:00+05:00',
    description: 'Hands-on session exploring the future of AI and deep learning with real-world applications.',
    category: 'TECHNOLOGY',
    status: 'approved'
  }
];

export const fallbackNews = [
  {
    _id: 'fallback-clean-up-news',
    isFallback: true,
    title: 'Namal Clean-Up Drive Creates a Greener Campus',
    category: 'EVENTS',
    summary: 'Students from multiple societies joined hands to clean and green key areas around campus and the lake.',
    publishedAt: '2025-06-18T10:00:00+05:00',
    image: cleanupImg
  },
  {
    _id: 'fallback-poetry-news',
    isFallback: true,
    title: 'Reading Circle: Poetry Evening at Rumi Library',
    category: 'ACADEMICS',
    summary: 'An evening of powerful verses and meaningful conversations hosted by the Literary Society.',
    publishedAt: '2025-06-15T10:00:00+05:00',
    image: poetryImg
  },
  {
    _id: 'fallback-neural-news',
    isFallback: true,
    title: 'NCS Workshop on Neural Networks',
    category: 'TECHNOLOGY',
    summary: 'Hands-on session exploring the future of AI and deep learning with real-world applications.',
    publishedAt: '2025-06-12T10:00:00+05:00',
    image: workshopImg
  }
];
