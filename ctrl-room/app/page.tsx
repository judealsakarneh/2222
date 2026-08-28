import {Hero} from '@/components/hero/Hero';
import {SystemStrip} from '@/components/discovery/SystemStrip';
import {LiveIndex} from '@/components/discovery/LiveIndex';
import {Picks} from '@/components/discovery/Picks';
import {Events} from '@/components/events/Events';
import {Elite} from '@/components/elite/Elite';
import {Partners} from '@/components/partners/Partners';
import {Social} from '@/components/social/Social';

/**
 * Section order is a rhythm, not a list. Each block deliberately differs in
 * structure from the one before it, because two adjacent sections sharing a
 * column layout is the loudest signal that a page was generated:
 *
 *   hero      full-bleed, layered, sticky
 *   strip     five even columns, hairline separated
 *   discover  asymmetric 4/7 with a sticky heading, index rows
 *   picks     bento, one lead tile and three
 *   events    horizontal rail, portrait posters
 *   elite     centred split, an object on one side
 *   partners  full-bleed colour band, the one loud block
 *   social    horizontal contact sheet, uneven widths
 *
 * Membership folds into Elite and community into Social on purpose. Eight
 * sections that each do something beats twelve that repeat each other.
 */
export default function Home() {
  return (
    <>
      <span id="top" />
      <Hero />
      <SystemStrip />
      <LiveIndex />
      <Picks />
      <Events />
      <Elite />
      <Partners />
      <Social />
    </>
  );
}
