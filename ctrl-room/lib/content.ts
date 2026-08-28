import {IMAGES, type ImageKey} from './images';

/**
 * All copy and data, kept out of the components.
 *
 * Anything the CTRL Room presentation actually establishes is used as written:
 * the four engines, the five content pillars, the coverage areas, the CTRL
 * Events formats, the Elite benefits, the partner proposition.
 *
 * Anything it does not establish - venue names, dates, counts, prices, member
 * numbers - is marked PLACEHOLDER and must be replaced before launch. Nothing
 * here asserts a partnership, a statistic or a customer that was not given.
 */

export const NAV = [
  {label: 'Discover', href: '#discover'},
  {label: 'Events', href: '#events'},
  {label: 'Membership', href: '#elite'},
  {label: 'Elite', href: '#elite'},
  {label: 'Community', href: '#community'},
  {label: 'Sponsors', href: '#partners'},
] as const;

/** The four engines the business is built on. From the presentation. */
export const ENGINES = [
  {n: '01', title: 'Media', body: "What's happening and what's trending in Jordan right now."},
  {n: '02', title: 'Discovery', body: 'Places, experiences, events, careers and opportunities.'},
  {n: '03', title: 'Community', body: 'Members, discounts, exclusive access and events.'},
  {n: '04', title: 'Commerce', body: 'Partnerships, leads, sponsorships and business services.'},
] as const;

/** The five content pillars. From the presentation. */
export const PILLARS = [
  {n: '01', title: "What's Trending", body: 'Instagram and TikTok trends, viral conversations, new businesses and products.'},
  {n: '02', title: 'CTRL Picks', body: 'Restaurants, cafés, hidden places, weekend trips. Amman, Aqaba and beyond.'},
  {n: '03', title: 'Career Room', body: 'Companies hiring, salary insights, startups, workplace culture.'},
  {n: '04', title: "What's On", body: 'Events, concerts, exhibitions, pop-ups, networking, sports, festivals.'},
  {n: '05', title: 'CTRL Intelligence', body: 'The things worth knowing this week, and why they matter.'},
] as const;

/** The utility strip under the hero. The operating system bar. */
export const SYSTEM = [
  {label: 'Places', note: 'Restaurants, cafés, wellness', href: '#discover'},
  {label: 'Events', note: "What's on in Amman", href: '#events'},
  {label: 'Membership', note: 'Access, perks, discounts', href: '#elite'},
  {label: 'Elite', note: 'The loyalty card', href: '#elite'},
  {label: 'Partners', note: 'Reach the room', href: '#partners'},
] as const;

/** Coverage areas. From the brief. Presented as an index, never as a map. */
export const AREAS = ['Abdoun', 'Sweifieh', 'Um Uthayna', 'Deir Ghbar'] as const;

/**
 * The insider index. These are the categories CTRL Room organises the city by.
 * Counts are PLACEHOLDER and must come from real data before launch.
 */
export const INDEX_ROWS = [
  {n: '01', label: 'Open late', note: 'Kitchens still serving after eleven', count: '—'},
  {n: '02', label: 'New openings', note: 'Doors that opened this month', count: '—'},
  {n: '03', label: 'Date spots', note: 'Rooms worth booking ahead for', count: '—'},
  {n: '04', label: 'Coffee', note: 'Roasters, benches, morning light', count: '—'},
  {n: '05', label: 'Wellness', note: 'Studios, courts, recovery', count: '—'},
  {n: '06', label: 'Hidden', note: 'The ones nobody posts about', count: '—'},
] as const;

export type Pick = {
  key: ImageKey;
  name: string;
  kind: string;
  area: (typeof AREAS)[number];
  note: string;
};

/** PLACEHOLDER venues. Names, areas and notes are invented for layout only. */
export const PICKS: Pick[] = [
  {key: 'restaurant', name: 'Placeholder Restaurant', kind: 'Dining', area: 'Abdoun', note: 'REPLACE with a real listing'},
  {key: 'cafe', name: 'Placeholder Roastery', kind: 'Coffee', area: 'Um Uthayna', note: 'REPLACE with a real listing'},
  {key: 'food', name: 'Placeholder Kitchen', kind: 'Levantine', area: 'Sweifieh', note: 'REPLACE with a real listing'},
  {key: 'nightlife', name: 'Placeholder Room', kind: 'Late night', area: 'Deir Ghbar', note: 'REPLACE with a real listing'},
];

export type CtrlEvent = {
  key: ImageKey;
  format: string;
  title: string;
  day: string;
  month: string;
  time: string;
  place: string;
  body: string;
};

/**
 * The five CTRL Room event formats are from the brief. Dates, times, venues
 * and titles below are PLACEHOLDER.
 */
export const EVENTS: CtrlEvent[] = [
  {
    key: 'venue',
    format: 'CTRL Nights',
    title: 'Placeholder Night',
    day: '00',
    month: 'TBC',
    time: 'Time TBC',
    place: 'REPLACE venue',
    body: 'Music, rooms and the people who fill them. Replace with a real listing.',
  },
  {
    key: 'session',
    format: 'CTRL Sessions',
    title: 'Placeholder Session',
    day: '00',
    month: 'TBC',
    time: 'Time TBC',
    place: 'REPLACE venue',
    body: 'Talks and conversations with people building things here.',
  },
  {
    key: 'nightlife',
    format: 'CTRL Weekends',
    title: 'Placeholder Weekend',
    day: '00',
    month: 'TBC',
    time: 'Time TBC',
    place: 'REPLACE venue',
    body: 'Two days, planned properly. Replace with a real listing.',
  },
  {
    key: 'restaurant',
    format: 'CTRL Experiences',
    title: 'Placeholder Experience',
    day: '00',
    month: 'TBC',
    time: 'Time TBC',
    place: 'REPLACE venue',
    body: 'Tables, tastings and rooms you would not find alone.',
  },
  {
    key: 'cafe',
    format: 'CTRL Careers',
    title: 'Placeholder Careers',
    day: '00',
    month: 'TBC',
    time: 'Time TBC',
    place: 'REPLACE venue',
    body: 'Hiring, salaries and the companies worth knowing.',
  },
];

/** Elite benefits. From the brief. */
export const ELITE_BENEFITS = [
  'Exclusive discounts',
  'Priority access',
  'Member-only events',
  'Partner rewards',
  'Special experiences',
] as const;

/** Who partners reach. From the brief. */
export const PARTNER_REACH = [
  {n: '01', label: 'Consumers', body: 'People deciding where to go this week.'},
  {n: '02', label: 'Members', body: 'A consented audience that opted in.'},
  {n: '03', label: 'Event audiences', body: 'Rooms you can stand in front of.'},
  {n: '04', label: 'Qualified customers', body: 'Intent, not impressions.'},
] as const;

export {IMAGES};
