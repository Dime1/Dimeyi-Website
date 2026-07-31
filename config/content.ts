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

export const STORY_MILESTONES = [
  {
    id: 'ch1',
    chapter: 'Chapter One',
    title: 'A Hello That Changed Everything',
    date: 'April 2018 · Covenant University',
    body: `Our story began at Covenant University. Before we ever spoke, Feyisogo noticed Oladimeji during a communion service at the university chapel. On April 8, 2018, after a chapel service, Oladimeji walked over, complimented Feyisogo's outfit, and introduced himself. They exchanged Instagram handles — unfortunately, he forgot to save hers. Almost three weeks later, on the final day of the semester, Feyisogo decided to send him a message herself. That single Instagram message turned into a conversation that lasted nearly five hours.`,
    photo: '[STORY_PHOTO_1]',
  },
  {
    id: 'ch2',
    chapter: 'Chapter Two',
    title: 'Choosing Friendship First',
    date: '2018',
    body: `Some months later, Oladimeji expressed that he wanted something more. Feyisogo wasn't ready. Life was taking them in different directions — he was graduating, while she still had years left at university. Instead of forcing timing, they chose friendship. It turned out to be one of the best decisions they could have made. They remained good friends even after Oladimeji finished school and relocated to Germany.`,
    photo: '[STORY_PHOTO_2]',
  },
  {
    id: 'ch3',
    chapter: 'Chapter Three',
    title: '[CHAPTER_3_TITLE]',
    date: '[CHAPTER_3_DATE]',
    body: '[CHAPTER_3_BODY]',
    photo: '[STORY_PHOTO_3]',
  },
  {
    id: 'ch4',
    chapter: 'Chapter Four',
    title: 'From Screens to Shared Moments',
    date: 'December 2023 · Germany',
    body: `After five years apart, Feyisogo boarded a flight to Germany. She remembers feeling nervous from the moment she landed. Then came the hug — the kind that makes time stand still. Neither wanted to let go. The visit became a glimpse into what everyday life together could look like.`,
    photo: '[STORY_PHOTO_4]',
  },
  {
    id: 'ch5',
    chapter: 'Chapter Five',
    title: 'Building Something Real',
    date: '2024',
    body: `Throughout 2024, Oladimeji travelled to the United States twice. Together they explored cities, created memories, met one another's families, and slowly answered the question: "Could this really become forever?" There was no pressure. Just intentional time spent learning one another beyond phone calls and video chats.`,
    photo: '[STORY_PHOTO_5]',
  },
  {
    id: 'ch6',
    chapter: 'Chapter Six',
    title: 'We Finally Said Yes',
    date: 'January 2025',
    body: `On New Year's Eve, while visiting the Museum of the Bible in Washington D.C., the conversation naturally turned toward the future. Before returning to Germany, Oladimeji asked Feyisogo to be his girlfriend. On January 2, 2025, she said yes. After nearly seven years of friendship, patience, growth, and countless miles between them, they officially became a couple.`,
    photo: '[STORY_PHOTO_6]',
  },
  {
    id: 'ch7',
    chapter: 'Chapter Seven',
    title: 'Long Distance, Closer Than Ever',
    date: '2025',
    body: `Their first year together was still long-distance. Yet somehow, they had never felt closer. Every day was filled with conversations, movie nights across time zones, shared prayers, and worship sessions together. One day, Feyisogo accidentally discovered something that perfectly captured Oladimeji's heart — he had quietly been building a wedding playlist since April 2024.`,
    photo: '[STORY_PHOTO_7]',
  },
  {
    id: 'ch8',
    chapter: 'Chapter Eight',
    title: 'Closing the Distance',
    date: 'January 2026',
    body: `Feyisogo relocated to Germany. After seven years of different countries, airports, video calls, and countdowns, they were finally living in the same place. Home was no longer measured by geography. Home had become each other.`,
    photo: '[STORY_PHOTO_8]',
  },
  {
    id: 'ch9',
    chapter: 'Chapter Nine',
    title: 'Two Families, One Future',
    date: 'February 2026 · Lagos, Nigeria',
    body: `In February 2026, they travelled together to Lagos, Nigeria. For the first time, both families spent meaningful time together. What had once been two separate families was beginning to become one.`,
    photo: '[STORY_PHOTO_9]',
  },
  {
    id: 'ch10',
    chapter: 'Chapter Ten',
    title: 'The Easiest Yes',
    date: 'March 2026 · Mallorca, Spain',
    body: `During a trip to Mallorca, Oladimeji planned a quiet picnic overlooking a vineyard. There he asked the question that had been years in the making. She said yes.`,
    photo: '[STORY_PHOTO_10]',
  },
] as const

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
    answer: 2,
  },
  {
    id: 'q5',
    question: 'When did they officially become a couple?',
    options: ['April 2018', 'December 2023', 'January 2, 2025', 'March 2026'],
    answer: 2,
  },
] as const

export const AUDIO = {
  src:    '/audio/cant-help-falling-in-love.mp3',
  title:  "Can't Help Falling in Love",
  artist: 'Elvis Presley',
} as const

export const NAV_LINKS = [
  { label: 'Our Story',    href: '/our-story',    gated: false },
  { label: 'Schedule',     href: '/schedule',     gated: true  },
  { label: 'Travel',       href: '/travel',       gated: true  },
  { label: 'RSVP',         href: '/rsvp',         gated: false },
  { label: 'Gallery',      href: '/gallery',      gated: false },
  { label: 'Guestbook',    href: '/guestbook',    gated: false },
  { label: 'Registry',     href: '/registry',     gated: false },
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
  { id: 'g1', src: '/images/gallery/[PHOTO_1].jpg', alt: '[PHOTO_1_ALT]', category: 'pre-wedding'  },
  { id: 'g2', src: '/images/gallery/[PHOTO_2].jpg', alt: '[PHOTO_2_ALT]', category: 'traditional'  },
  { id: 'g3', src: '/images/gallery/[PHOTO_3].jpg', alt: '[PHOTO_3_ALT]', category: 'family'       },
  { id: 'g4', src: '/images/gallery/[PHOTO_4].jpg', alt: '[PHOTO_4_ALT]', category: 'pre-wedding'  },
  { id: 'g5', src: '/images/gallery/[PHOTO_5].jpg', alt: '[PHOTO_5_ALT]', category: 'traditional'  },
  { id: 'g6', src: '/images/gallery/[PHOTO_6].jpg', alt: '[PHOTO_6_ALT]', category: 'family'       },
] as const

export type GalleryImage    = typeof GALLERY_IMAGES[number]
export type GalleryCategory = 'all' | GalleryImage['category']

export const REGISTRY_LINKS = [
  { id: 'r1', label: '[REGISTRY_1_NAME]', url: '[REGISTRY_1_URL]', note: '[REGISTRY_1_NOTE]' },
  { id: 'r2', label: '[REGISTRY_2_NAME]', url: '[REGISTRY_2_URL]', note: '[REGISTRY_2_NOTE]' },
] as const
