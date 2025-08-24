import React, { useEffect, useMemo, useState } from 'react';
import { Zap, Star, Heart, Gift } from 'lucide-react';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
import img6 from '../assets/img6.jpg';

type ColorKey = 'yellow' | 'blue' | 'pink';

const colorMap: Record<ColorKey, { bg: string; text: string }> = {
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-500' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-500' },
};

interface PhotoItem {
  url: string;
  caption: string;
  effect: string;
  color: ColorKey;
}

const images: PhotoItem[] = [
  { url: img1, caption: 'whyyy so madddd', effect: 'WIWIWI!', color: 'yellow' }, // excluded
  { url: img2, caption: 'will buy u melody if u maaf', effect: 'YEYEY!', color: 'blue' },
  { url: img3, caption: 'hello princess', effect: 'WUWUWU!', color: 'yellow' },
  { url: img4, caption: 'maaf me pls', effect: 'HEHEH!', color: 'blue' },
  { url: img5, caption: 'again im solly', effect: 'WIWIWI!', color: 'yellow' },
  { url: img6, caption: 'i lob u!', effect: 'WUWUWU!', color: 'blue' },
];

type PhotoGalleryProps = {
  onOpenSurprise?: () => void;
  onFlip?: (index: number, active: boolean) => void;
};

const SurpriseBoxCenter = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
               w-52 h-52 md:w-64 md:h-64 rounded-2xl bg-gradient-to-br from-pink-200 via-pink-100 to-white
               border-8 border-black shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300
               transition-transform duration-300 hover:scale-105"
    aria-label="Open cute surprise"
  >
    <div className="absolute inset-0 rounded-[14px] border-4 border-pink-400 pointer-events-none" aria-hidden />
    <div className="absolute inset-8 rounded-xl bg-white border-4 border-pink-300 shadow-inner" aria-hidden />
    <div className="absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-7 rounded bg-pink-400" aria-hidden />
    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-7 rounded bg-pink-400" aria-hidden />
    <div
      className="absolute -top-1 left-6 right-6 h-14 rounded-xl bg-pink-300 border-4 border-pink-400 shadow
                 transition-transform duration-300 group-hover:-translate-y-1 group-focus:-translate-y-1"
      aria-hidden
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
      <Gift className="text-pink-500 mb-1" size={48} />
      <div className="text-5xl md:text-6xl leading-none">ʕ•́ᴥ•̀ʔっ</div>
      <div className="mt-1 text-sm text-pink-600 opacity-80">hug?</div>
    </div>
    <div className="absolute bottom-4 left-0 right-0 text-center text-pink-700 font-semibold">
      Open Surprise →
    </div>
  </button>
);

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onOpenSurprise, onFlip }) => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  // Escape closes the active tile
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFlippedIndex(null);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  // Preload images to avoid pop-in
  useEffect(() => {
    const toLoad = images.slice(1);
    toLoad.forEach((im) => {
      const i = new Image();
      i.src = im.url;
    });
  }, []);

  const visibleImages = useMemo(() => images.slice(1), []);
  const count = visibleImages.length;

  const largeIndices = new Set<number>([1, 3]);
  const baseRadius = 42; // %
  const largePush = 3;

  const getPos = (i: number, isLarge: boolean) => {
    const theta = (2 * Math.PI * i) / count - Math.PI / 2; // start top
    const r = baseRadius + (isLarge ? largePush : 0);
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);
    return { left: `${x}%`, top: `${y}%` };
  };

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getEffectIcon = (index: number, colorKey: ColorKey, isLarge: boolean) => {
    const tint = colorMap[colorKey].text;
    const size = isLarge ? 24 : 20;
    const icons = [
      <Zap key={`icon-${index}-zap`} size={size} className={tint} aria-hidden />,
      <Star key={`icon-${index}-star`} size={size} className={tint} aria-hidden />,
      <Heart key={`icon-${index}-heart`} size={size} className={tint} aria-hidden />,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="relative mx-auto w-full max-w-[680px] aspect-square">
      <SurpriseBoxCenter onClick={onOpenSurprise} />

      {visibleImages.map((image, i) => {
        const isLarge = largeIndices.has(i);
        const pos = getPos(i, isLarge);
        const active = flippedIndex === i;

        const sizeCls = isLarge ? 'w-32 h-32 md:w-40 md:h-40' : 'w-24 h-24 md:w-32 md:h-32';
        const burstTextSize = isLarge ? 'text-sm' : 'text-xs';
        const burstPad = isLarge ? 'py-1.5 px-3.5' : 'py-1 px-3';

        return (
          <div
            key={`circle-img-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: pos.left, top: pos.top }}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`${active ? 'Hide' : 'Show'} caption: ${image.caption}`}
              aria-pressed={active}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const nextActive = !active;
                  setFlippedIndex(nextActive ? i : null);
                  onFlip?.(i, nextActive);
                  if (navigator.vibrate) navigator.vibrate(5);
                }
              }}
              onClick={() => {
                const nextActive = !active;
                setFlippedIndex(nextActive ? i : null);
                onFlip?.(i, nextActive);
                if (navigator.vibrate) navigator.vibrate(5);
              }}
              className={[
                'bg-white rounded-2xl p-2 border-8 border-black shadow-lg',
                reduceMotion ? 'transition-none' : 'transition-all duration-500',
                sizeCls,
                'transform',
                'focus:outline-none focus-visible:ring-4 focus-visible:ring-black/20',
                active ? 'scale-105 rotate-3' : 'hover:scale-105 hover:rotate-1',
              ].join(' ')}
            >
              {/* Burst */}
              <div
                className={[
                  'absolute -top-3 -right-3 z-10',
                  colorMap[image.color].bg,
                  'text-white font-comic font-bold',
                  burstPad,
                  'rounded-full transform rotate-12',
                  reduceMotion ? '' : 'transition-all duration-300',
                  active ? 'scale-110' : 'scale-100',
                ].join(' ')}
                style={{ border: '2px solid black', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                aria-hidden
              >
                <span className={burstTextSize}>{image.effect}</span>
              </div>

              <div className="relative overflow-hidden rounded-lg w-full h-full">
                <img
                  src={image.url}
                  alt={image.caption || `Photo ${i + 1}`}
                  className={[
                    'w-full h-full object-cover',
                    reduceMotion ? '' : 'transition-all duration-500',
                    active ? 'brightness-110 contrast-110' : '',
                  ].join(' ')}
                  loading="lazy"
                />

                {/* Caption */}
                <div
                  className={[
                    'speech-bubble-comic absolute bottom-1 left-1 right-1 bg-white px-2 py-1 rounded-md',
                    reduceMotion ? '' : 'transform transition-all duration-500',
                    active ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                  ].join(' ')}
                  style={{ border: '2px solid black', boxShadow: '2px 2px 0 rgba(0,0,0,0.2)' }}
                >
                  <p className="font-comic text-center text-gray-800 text-[10px] leading-tight">
                    {image.caption}
                  </p>
                </div>
              </div>

              {/* Decorative icon */}
              <div className="absolute -bottom-3 -left-3 transform -rotate-12" aria-hidden>
                {getEffectIcon(i, image.color, isLarge)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhotoGallery;
