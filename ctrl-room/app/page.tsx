import {Hero} from '@/components/hero/Hero';
import {SystemStrip} from '@/components/discovery/SystemStrip';
import {LiveIndex} from '@/components/discovery/LiveIndex';
import {Picks} from '@/components/discovery/Picks';
import {Events} from '@/components/events/Events';
import {Elite} from '@/components/elite/Elite';
import {Partners} from '@/components/partners/Partners';
import {Social} from '@/components/social/Social';
import {ColorSeam, GroundFold, TealSeam} from '@/components/ui/ColorSeam';

/**
 * The page is one journey through three environments rather than a stack of
 * blocks, and the seams are part of the design rather than the gaps between
 * parts of it.
 *
 *   dark    hero, the system strip, the discovery index
 *   SEAM    DISCOVER wipes to paper, the word inverting through the boundary
 *   paper   CTRL Picks, photographs on stock
 *   SEAM    AFTER DARK returns to black
 *   dark    the event rail, posters on black
 *   SEAM    MEMBERSHIP back to paper
 *   paper   CTRL Elite, a black card on stock
 *   SEAM    PARTNERS, teal opening outward from the centre
 *   teal    the partner proposition, the one loud block
 *   dark    the community feed and the footer
 *
 * Section order still varies in construction as well as in colour, so no two
 * adjacent blocks share both a ground and a column structure.
 */
export default function Home() {
  return (
    <>
      <span id="top" />
      <Hero />
      <SystemStrip />
      <LiveIndex />

      <ColorSeam from="dark" to="paper" word="Discover" />
      <Picks />

      <ColorSeam from="paper" to="dark" word="After dark" />
      <Events />

      <ColorSeam from="dark" to="paper" word="Membership" />
      <Elite />

      <TealSeam from="paper" word="Partners" />
      <Partners />

      {/* The one environment change with no seam in front of it. Without
          this the teal act ended on a straight horizontal line. */}
      <GroundFold from="teal" to="dark" />

      <Social />
    </>
  );
}
