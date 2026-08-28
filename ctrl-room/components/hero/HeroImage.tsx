import {IMAGES} from '@/lib/images';

/**
 * The hero photograph and its art direction, in one place.
 *
 * Replacing the picture is a single line in lib/images.ts. Changing how it is
 * treated - the crop, the dissolve, the scrim - is this file and nothing else.
 * The Hero owns the choreography; this owns the image.
 *
 * The dissolve is the reason the headline can sit inside the photograph rather
 * than beside it: the left edge is masked to transparent so there is no seam
 * for type to run into. Below lg the picture sits under the headline instead
 * of next to it, so it takes a scrim there and drops the horizontal mask.
 */
export function HeroImage({className = ''}: {className?: string}) {
  const img = IMAGES.hero;
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 22%, #000 52%), linear-gradient(180deg, #000 62%, transparent 100%)',
          maskImage:
            'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 22%, #000 52%), linear-gradient(180deg, #000 62%, transparent 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      >
        <img
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          fetchPriority="high"
          decoding="async"
          sizes="(max-width: 1023px) 100vw, 68vw"
          className="h-full w-full object-cover object-[64%_center]"
        />
      </div>

      {/* Below lg the picture is under the type, so it needs its own ground.
          Removed at lg, where the mask does the work and a scrim would only
          flatten the photograph.

          The alphas are set from the measured worst case, not by eye. The
          brightest pixels behind the headline are the lit ceiling panels at
          L 0.77, and the teal second line is the lowest-contrast text on the
          site against them; these values put it comfortably clear of the 3:1
          floor for large type instead of a hairsbreadth over it.

          The mask releases the scrim below the content block, so the lower
          third of the frame - where nothing is set - keeps the photograph at
          something near full strength rather than dimming the whole picture
          to protect type that is not there. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(to right, rgba(11,11,11,0.95) 0%, rgba(11,11,11,0.89) 46%, rgba(11,11,11,0.62) 100%)',
          WebkitMaskImage:
            'linear-gradient(180deg, #000 0%, #000 72%, rgba(0,0,0,0.3) 100%)',
          maskImage: 'linear-gradient(180deg, #000 0%, #000 72%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </div>
  );
}
