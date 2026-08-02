export const COUPLE = {
  bride:        'Feyisogo',
  groom:        'Oladimeji',
  groomNick:    'Dimeji',
  displayNames: 'Feyisogo & Dimeji',
  fullNames:    'Feyisogo & Oladimeji',
  hashtag:      '[WEDDING_HASHTAG]',
} as const

export const WEDDING = {
  date:      new Date('2027-02-18T00:00:00Z'),
  dateLabel: 'February 18, 2027',
  venue:     '[VENUE_NAME]',
} as const

export const VERSES = {
  hero:     { text: '"He has made everything beautiful in its time."', ref: 'Ecclesiastes 3:11' },
  timeline: { text: '"Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken."', ref: 'Ecclesiastes 4:12' },
  rsvp:     { text: '"Love is patient, love is kind."', ref: '1 Corinthians 13:4' },
  schedule: { text: '"Where you go I will go, and where you stay I will stay."', ref: 'Ruth 1:16' },
  gallery:  { text: '"Many waters cannot quench love; rivers cannot sweep it away."', ref: 'Song of Solomon 8:7' },
  footer:   { text: '"Many waters cannot quench love; rivers cannot sweep it away."', ref: 'Song of Solomon 8:7' },
} as const

export const STORY_MOVEMENTS = [
  {
    id:        'friendship',
    variant:   'friendship',
    title:     'Friendship First',
    period:    '2018 — 2024',
    fragments: [
      'Day One.',
      'Start of a friendship that would later bloom',
    ],
    body:      `The story began at Covenant University Chapel, where Dimeji met Feyi for the first time at the start of 2018. It started after a thanksgiving service, where Dimeji gave Feyi an outfit compliment, an introduction, and an exchange of social media handles. They eventually spoke more often, gained interest in each other, but chose to pursue friendship instead. As Dimeji graduated, they both remained friends while moving on with their lives. Even though the next time they would see each other would be almost six years later, they stayed friends, with check-ins and periodic life updates.`,
    verse:     { text: '"There is a time for everything, and a season for every activity under the heavens."', ref: 'Ecclesiastes 3:1' },
    heroPhoto: '/story/Friendship pic.jpg',
    auxPhotos: [],
  },
  {
    id:        'dating',
    variant:   'dating',
    title:     'The Distance Between',
    period:    '2024 — 2025',
    fragments: [
      'Different cities. Different time zones.',
      'Many decisions, leading with intentionality',
    ],
    body:      `Feyi and Dimeji reconnected as friends, but this time the conversations were different, with deeper discussions about life, family, and each other. With both of them now living outside Nigeria in US and Germany respectively, the uncertainties and distance made it seem impossible for anything beyond friendship to surface. However, life told a different story. As they spoke more, there came a realization that there was something to be built. Nevertheless, it required navigating the highs and lows that come with timezones, distance, and general life challenges. They evaluated the possibilities and put their best foot forward. In 2025, they officially started a relationship, and began plans on bridging the distance gap.`,
    verse:     { text: '"Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken."', ref: 'Ecclesiastes 4:12' },
    heroPhoto: '/story/Bridging the distance.JPG',
    auxPhotos: [],
  },
  {
    id:        'proposal',
    variant:   'proposal',
    title:     'The Happiest Yes',
    period:    'January — March 2026',
    fragments: [
      'A leap of faith.',
      'and the countdown begins. Tik Tok Tik',
    ],
    body:      `In January 2026, Feyisogo relocated to Germany. After seven years of different countries, airports, and video calls, they were finally in the same country. With things becoming more serious and intentional, in February, they travelled to Lagos together to get to know each other's parents, and for Dimeji to get the blessing for the big question. Then, in March 2026, in Mallorca, Spain, Dimeji planned a quiet picnic overlooking a vineyard, popping the question and getting a sweet "YES" as an answer that would start this lifelong journey. Welcome to Chapter One of our story......`,
    verse:     { text: '"I have found the one whom my soul loves."', ref: 'Song of Solomon 3:4' },
    heroPhoto: '/story/Proposal.jpg',
    auxPhotos: [],
  },
] as const

export type StoryMovement   = typeof STORY_MOVEMENTS[number]
export type MovementVariant = StoryMovement['variant']

export const EVENTS = [
  {
    id: 'traditional',
    name: 'Traditional Engagement',
    date: '[TRADITIONAL_DATE]',
    time: '[TRADITIONAL_TIME]',
    location: '[TRADITIONAL_VENUE]',
    dresscode: '[TRADITIONAL_DRESSCODE]',
    note: "The traditional Yoruba engagement ceremony (introduction) is a joyful celebration where two families formally meet and the groom's family presents gifts to the bride's family.",
  },
  {
    id: 'ceremony',
    name: 'Church Ceremony',
    date: 'February 18, 2027',
    time: '[CEREMONY_TIME]',
    location: '[CEREMONY_VENUE]',
    dresscode: '[CEREMONY_DRESSCODE]',
    note: '',
  },
  {
    id: 'reception',
    name: 'Reception',
    date: 'February 18, 2027',
    time: '[RECEPTION_TIME]',
    location: '[RECEPTION_VENUE]',
    dresscode: '[RECEPTION_DRESSCODE]',
    note: 'Aso-ebi (coordinated family fabric) details will be shared with confirmed guests.',
  },
] as const

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Where did Feyisogo and Dimeji first meet?',
    options: ['A library', 'Covenant University chapel', "A mutual friend's party", 'Online'],
    answer: 1,
  },
  {
    id: 'q2',
    question: 'How long did their first Instagram conversation last?',
    options: ['1 hour', '2 hours', '5 hours', 'All night'],
    answer: 2,
  },
  {
    id: 'q3',
    question: 'Where did Dimeji propose?',
    options: ['Paris, France', 'Lagos, Nigeria', 'Mallorca, Spain', 'Washington D.C.'],
    answer: 2,
  },
  {
    id: 'q4',
    question: 'In what year did Feyisogo move to Germany?',
    options: ['2024', '2025', '2026', '2027'],
    answer: 1,
  },
  {
    id: 'q5',
    question: 'What year and month did Feyi say yes to Dimeji when he proposed?',
    options: ['June 2026', 'February 2026', 'December, 2025', 'March 2026'],
    answer: 3,
  },
  {
    id: 'q6',
    question: 'Which country did Feyisogo travel to for the first time to visit Dimeji?',
    options: ['United Kingdom', 'United States', 'Germany', 'Nigeria'],
    answer: 2,
  },
  {
    id: 'q7',
    question: 'Where were Dimeji and Feyisogo when the conversation about entering a relationship?',
    options: ['A rooftop restaurant in Lagos', 'Museum of the Bible, Washington D.C.', 'A beach in Mallorca', 'The Covenant University chapel'],
    answer: 1,
  },
  {
    id: 'q8',
    question: 'How much was the time difference the couple had to keep up with',
    options: ['6 hours', '7 hours', '8 hours', '9 hours'],
    answer: 0,
  },
  {
    id: 'q9',
    question: 'Where was the couples very first trip together',
    options: ['Mallorca, Spain', 'Washington D.C., USA', 'Paris, France', 'Frankfurt, Germany'],
    answer: 1,
  },
  {
    id: 'q10',
    question: 'What was the setting Dimeji chose for the proposal in Mallorca?',
    options: ['A rooftop at sunset', 'A beach at midnight', 'A quiet picnic overlooking a vineyard', 'A private boat'],
    answer: 2,
  },
] as const

export const AUDIO = {
  src:    '/audio/cant help falling.mp3',
  title:  "Can't Help Falling in Love",
  artist: 'Elvis Presley',
} as const

export const NAV_LINKS = [
  { label: 'Our Story',    href: '/our-story',  gated: false },
  { label: 'D-Day',        href: '/d-day',      gated: true  },
  { label: 'RSVP',         href: '/rsvp',       gated: false },
  { label: 'Gallery',      href: '/gallery',    gated: false },
  { label: 'Ode to the Couple', href: '/guestbook', gated: false },
  { label: 'Registry',     href: '/registry',   gated: false },
] as const

export const TRAVEL_INFO = {
  country:         'Nigeria',
  city:            '[CITY]',
  region:          '[STATE]',
  airportName:     '[AIRPORT_NAME]',
  airportDistance: '[X km] from venue',
  hotels: [
    {
      name:        '[HOTEL_1_NAME]',
      area:        '[HOTEL_1_AREA]',
      bookingCode: '[HOTEL_1_BOOKING_CODE]',
      url:         '[HOTEL_1_URL]',
    },
    {
      name:        '[HOTEL_2_NAME]',
      area:        '[HOTEL_2_AREA]',
      bookingCode: '[HOTEL_2_BOOKING_CODE]',
      url:         '[HOTEL_2_URL]',
    },
  ],
  ceremonyAddress:  '[CEREMONY_FULL_ADDRESS]',
  receptionAddress: '[RECEPTION_FULL_ADDRESS]',
} as const

export const GALLERY_IMAGES = [
  { id: 'g1',  src: '/Website pictures/Couple journey/1da38230-1fd5-4105-9ba2-32494a7a0801.jpg',                      alt: 'Feyisogo and Dimeji 1',  category: 'couple-journey' },
  { id: 'g2',  src: '/Website pictures/Couple journey/20251222_135503.jpg',                                           alt: 'Feyisogo and Dimeji 2',  category: 'couple-journey' },
  { id: 'g3',  src: '/Website pictures/Couple journey/20251227_145452.jpg',                                           alt: 'Feyisogo and Dimeji 3',  category: 'couple-journey' },
  { id: 'g4',  src: '/Website pictures/Couple journey/20260124_134152.jpg',                                           alt: 'Feyisogo and Dimeji 4',  category: 'couple-journey' },
  { id: 'g5',  src: '/Website pictures/Couple journey/afcec267-cf57-45f3-ad83-a949dbcfb01d.jpg',                      alt: 'Feyisogo and Dimeji 5',  category: 'couple-journey' },
  { id: 'g6',  src: '/Website pictures/Couple journey/IMG_0305.jpeg',                                                 alt: 'Feyisogo and Dimeji 6',  category: 'couple-journey' },
  { id: 'g7',  src: '/Website pictures/Couple journey/IMG_0852.jpeg',                                                 alt: 'Feyisogo and Dimeji 7',  category: 'couple-journey' },
  { id: 'g8',  src: '/Website pictures/Couple journey/IMG_1078.jpeg',                                                 alt: 'Feyisogo and Dimeji 8',  category: 'couple-journey' },
  { id: 'g9',  src: '/Website pictures/Couple journey/IMG_1365.jpeg',                                                 alt: 'Feyisogo and Dimeji 9',  category: 'couple-journey' },
  { id: 'g10', src: '/Website pictures/Couple journey/IMG_1453.jpeg',                                                 alt: 'Feyisogo and Dimeji 10', category: 'couple-journey' },
  { id: 'g11', src: '/Website pictures/Couple journey/IMG_9509.JPG',                                                  alt: 'Feyisogo and Dimeji 11', category: 'couple-journey' },
  { id: 'g12', src: '/Website pictures/Couple journey/IMG_9519.JPG',                                                  alt: 'Feyisogo and Dimeji 12', category: 'couple-journey' },
  { id: 'g13', src: '/Website pictures/Couple journey/IMG_9934.jpg',                                                  alt: 'Feyisogo and Dimeji 13', category: 'couple-journey' },
  { id: 'g14', src: '/Website pictures/Couple journey/IMG-20251215-WA0020.jpg',                                       alt: 'Feyisogo and Dimeji 14', category: 'couple-journey' },
  { id: 'g15', src: '/Website pictures/Couple journey/IMG-20251220-WA0042.jpg',                                       alt: 'Feyisogo and Dimeji 15', category: 'couple-journey' },
  { id: 'g16', src: '/Website pictures/Couple journey/IMG-20251221-WA0096.jpg',                                       alt: 'Feyisogo and Dimeji 16', category: 'couple-journey' },
  { id: 'g17', src: '/Website pictures/Couple journey/IMG-20251221-WA0228.jpg',                                       alt: 'Feyisogo and Dimeji 17', category: 'couple-journey' },
  { id: 'g18', src: '/Website pictures/Couple journey/IMG-20260529-WA0014.jpg',                                       alt: 'Feyisogo and Dimeji 18', category: 'couple-journey' },
  { id: 'g19', src: '/Website pictures/Couple journey/moment_4a2096f891864a6186ba2997116c0996_1754580969770.jpg',     alt: 'Feyisogo and Dimeji 19', category: 'couple-journey' },
  { id: 'g20', src: '/Website pictures/Couple journey/Snapchat-2131585173.jpg',                                       alt: 'Feyisogo and Dimeji 20', category: 'couple-journey' },
  { id: 'g21', src: '/Website pictures/Proposal/BeautyPlus_20260325220500912_save.jpg',                               alt: 'Feyisogo and Dimeji 21', category: 'proposal'        },
  { id: 'g22', src: '/Website pictures/Proposal/IMG_7858.jpg',                                                        alt: 'Feyisogo and Dimeji 22', category: 'proposal'        },
  { id: 'g23', src: '/Website pictures/Proposal/IMG_8128.jpg',                                                        alt: 'Feyisogo and Dimeji 23', category: 'proposal'        },
  { id: 'g24', src: '/Website pictures/Proposal/IMG_8143.jpg',                                                        alt: 'Feyisogo and Dimeji 24', category: 'proposal'        },
  { id: 'g25', src: '/Website pictures/Proposal/IMG_8228.jpg',                                                        alt: 'Feyisogo and Dimeji 25', category: 'proposal'        },
  { id: 'g26', src: '/Website pictures/Proposal/IMG_8328.jpg',                                                        alt: 'Feyisogo and Dimeji 26', category: 'proposal'        },
  { id: 'g27', src: '/Website pictures/Proposal/IMG_8370.jpg',                                                        alt: 'Feyisogo and Dimeji 27', category: 'proposal'        },
  { id: 'g28', src: '/Website pictures/Proposal/IMG_7881.jpg',                                                        alt: 'Feyisogo and Dimeji 28', category: 'proposal'        },
  { id: 'g29', src: '/Website pictures/Proposal/IMG_8142.jpg',                                                        alt: 'Feyisogo and Dimeji 29', category: 'proposal'        },
  { id: 'g30', src: '/Website pictures/Proposal/IMG_8273.jpg',                                                        alt: 'Feyisogo and Dimeji 30', category: 'proposal'        },
  { id: 'g31', src: '/Website pictures/Proposal/IMG_8300.jpg',                                                        alt: 'Feyisogo and Dimeji 31', category: 'proposal'        },
  { id: 'g32', src: '/Website pictures/Proposal/IMG_8433.jpg',                                                        alt: 'Feyisogo and Dimeji 32', category: 'proposal'        },
  { id: 'g33', src: '/Website pictures/Proposal/IMG_8495.jpg',                                                        alt: 'Feyisogo and Dimeji 33', category: 'proposal'        },
  { id: 'g34', src: '/Website pictures/Proposal/IMG_7837.jpg',                                                        alt: 'Feyisogo and Dimeji 34', category: 'proposal'        },
  { id: 'g35', src: '/Website pictures/Proposal/IMG_8087.jpg',                                                        alt: 'Feyisogo and Dimeji 35', category: 'proposal'        },
  { id: 'g36', src: '/Website pictures/Proposal/IMG_8162.jpg',                                                        alt: 'Feyisogo and Dimeji 36', category: 'proposal'        },
  { id: 'g37', src: '/Website pictures/Proposal/IMG_8324.jpg',                                                        alt: 'Feyisogo and Dimeji 37', category: 'proposal'        },
] as const

export type GalleryImage    = typeof GALLERY_IMAGES[number]
export type GalleryCategory = 'all' | GalleryImage['category']

