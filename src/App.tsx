import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Heart, X } from 'lucide-react';
import HeartGame from './components/HeartGame';
import PhotoGallery from './components/PhotoGallery';
import './EnvelopeAnimation.css';
import askImg from './assets/img1.jpg';

// Lightweight heart confetti (no external deps)
function fireHeartsBurst(container: HTMLElement | null) {
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.textContent = '❤';
    el.setAttribute('aria-hidden', 'true');
    el.style.position = 'absolute';
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.fontSize = `${12 + Math.random() * 16}px`;
    el.style.color = ['#f472b6', '#ef4444', '#fb7185'][i % 3];
    el.style.pointerEvents = 'none';
    el.style.opacity = '1';
    el.style.transition = 'transform 900ms ease, opacity 900ms ease';

    const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.6 - 0.3);
    const radius = 80 + Math.random() * 90;
    const tx = Math.cos(angle) * radius;
    const ty = Math.sin(angle) * radius;

    container.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${(Math.random() * 2 - 1) * 40}deg)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 950);
  }
}

const EnvelopeOverlay = ({ onFinish }: { onFinish: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => onFinish(), 1200);
  };
  return (
    <div
      className={`envelope-overlay ${isOpen ? 'fade-out' : ''}`}
      role="button"
      aria-label="Open letter"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
    >
      <div className={`envelope ${isOpen ? 'open' : ''}`}>
        <div className="envelope-flap"></div>
        <div className="envelope-body"></div>
        <span className="envelope-text">Click to open</span>
      </div>
    </div>
  );
};

type HeartBubble = {
  left: string;
  top: string;
  delay: string;
  duration: string;
  scale: string;
};

type Answer = 'yess' | 'nahh' | null;

const QuestionModal = ({
  imageSrc,
  answer,
  onAnswer,
  onClose,
}: {
  imageSrc: string;
  answer: Answer;
  onAnswer: (a: Exclude<Answer, null>) => void;
  onClose: () => void;
}) => {
  const [imgHeight, setImgHeight] = useState(224);
  const [nahhFlipped, setNahhFlipped] = useState(false);
  const confettiRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (answer === null) setNahhFlipped(false);
  }, [answer]);

  useEffect(() => {
    const t = setTimeout(() => setImgHeight(360), 20);
    return () => clearTimeout(t);
  }, []);

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
  }, [imageSrc]);

  const onNahhClick = () => {
    if (!nahhFlipped) {
      setNahhFlipped(true);
      if (navigator.vibrate) navigator.vibrate(8);
    } else {
      onAnswer('yess');
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (confettiRef.current) {
        fireHeartsBurst(confettiRef.current);
      }
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-title"
    >
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Confetti hearts container */}
        <div ref={confettiRef} className="absolute inset-0 pointer-events-none" aria-hidden />

        {/* Animated image container */}
        <div
          className="w-full overflow-hidden"
          style={{
            height: imgHeight,
            transition: 'height 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <img
            src={imageSrc}
            alt="Cute ask"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-5">
          {answer === null && (
            <>
              <h3 id="question-title" className="text-xl font-semibold text-gray-800 text-center mb-3">
                Mere sath ghoomne chalogi  ?
              </h3>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    onAnswer('yess');
                    if (navigator.vibrate) navigator.vibrate([10, 40, 10]);
                    fireHeartsBurst(confettiRef.current);
                  }}
                  className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300"
                >
                  yess
                </button>

                <button
                  onClick={onNahhClick}
                  className={`px-5 py-2.5 rounded-full font-semibold shadow focus:outline-none
                        ${nahhFlipped
                          ? 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-4 focus:ring-pink-300'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300'}`}
                  title={nahhFlipped ? 'hehe 😸' : undefined}
                >
                  {nahhFlipped ? 'yess' : 'nahh'}
                </button>
              </div>
            </>
          )}

          {answer === 'yess' && (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-pink-600 mb-2">Yay! 💖</h3>
              <p className="text-gray-700">
               please text if you accept me . Also… sorry again for what happened—I have some plan for us.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300"
              >
                Close
              </button>
            </div>
          )}

          {answer === 'nahh' && (
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Aww… 🥺</h3>
              <p className="text-gray-700">Okay, maybe another time. Still sending hugs.</p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 rounded-full bg-gray-800 text-white font-semibold shadow hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [name] = useState('My cute little heart shikha');
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answer, setAnswer] = useState<Answer>(null);

  // Sticky-note + corner sticker
  const [showSticky, setShowSticky] = useState(false);
  const [cornerSticker, setCornerSticker] = useState(false);

  // Interaction-based unlock
  const [interactions, setInteractions] = useState(0);
  const [showMemory, setShowMemory] = useState(false);

  const bumpInteractions = (n = 1) => {
    setInteractions((v) => {
      const next = v + n;
      if (next >= 10 && !showMemory) setShowMemory(true);
      return next;
    });
  };

  const hearts = useMemo<HeartBubble[]>(
    () =>
      Array.from({ length: 15 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${15 + Math.random() * 15}s`,
        scale: `scale(${0.5 + Math.random() * 1.5})`,
      })),
    []
  );

  useEffect(() => {
    const overlayActive = showEnvelope || showQuestion || showSticky;
    if (overlayActive) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showEnvelope, showQuestion, showSticky]);

  // Corner sticker helper
  const placeCornerSticker = () => {
    setCornerSticker(true);
    if (navigator.vibrate) navigator.vibrate([6, 20, 6]);
  };

  // Orbit button ref and anchored sticky positioning
  const orbitBtnRef = useRef<HTMLButtonElement | null>(null);
  const [stickyPos, setStickyPos] = useState<{ top: number; left: number; placement: 'right' | 'left' | 'top' | 'bottom' }>({
    top: 0,
    left: 0,
    placement: 'right',
  });

  function openStickyAnchored() {
    const btn = orbitBtnRef.current;
    if (!btn) {
      setShowSticky(true);
      return;
    }
    const r = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const popW = 280;
    const popH = 180;
    const gap = 10;

    let placement: 'right' | 'left' | 'top' | 'bottom' = 'right';
    let top = r.top + r.height / 2 - popH / 2;
    let left = r.right + gap;

    if (left + popW > vw) {
      placement = 'left';
      left = r.left - gap - popW;
    }
    if (left < 0) {
      placement = 'bottom';
      left = r.left + r.width / 2 - popW / 2;
      top = r.bottom + gap;
    }
    if (top + popH > vh) {
      placement = 'top';
      top = r.top - gap - popH;
      left = r.left + r.width / 2 - popW / 2;
    }

    top = Math.max(8, Math.min(vh - popH - 8, top));
    left = Math.max(8, Math.min(vw - popW - 8, left));

    setStickyPos({ top, left, placement });
    setShowSticky(true);
  }

  // Escape closes sticky
  useEffect(() => {
    if (!showSticky) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowSticky(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [showSticky]);

  return (
    <div className="relative">
      {showEnvelope ? (
        <EnvelopeOverlay onFinish={() => setShowEnvelope(false)} />
      ) : (
        <div className="fade-in">
          <div className="min-h-screen bg-pink-50 font-comic relative overflow-x-hidden">
            {/* Floating hearts background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              {hearts.map((h, i) => (
                <div
                  key={i}
                  className="absolute animate-float opacity-20"
                  style={{
                    left: h.left,
                    top: h.top,
                    animationDelay: h.delay,
                    animationDuration: h.duration,
                    transform: h.scale,
                  }}
                >
                  <Heart size={30} fill="#f472b6" stroke="#f472b6" />
                </div>
              ))}
            </div>

            {/* Header */}
            <header className="relative pt-16 pb-20 text-center z-10">
              <h1 className="text-5xl md:text-7xl font-bold text-pink-600 animate-bounce-slow inline-block relative">
                I'm Sorry {name}
                <span className="absolute -top-6 -right-6 animate-float-delay">
                  <Heart size={30} fill="#f472b6" stroke="#f472b6" />
                </span>
                <span className="absolute -bottom-4 -left-6 animate-float">
                  <Heart size={24} fill="#f472b6" stroke="#f472b6" />
                </span>
              </h1>

              {/* Orbiting "sorry note" button → opens anchored sticky note */}
              <div className="relative mt-6 h-20">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none" aria-hidden>
                  <div className="absolute inset-0 rounded-full border-2 border-pink-200/70"></div>
                </div>
                <button
                  ref={orbitBtnRef}
                  onClick={openStickyAnchored}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                             w-28 h-10 bg-white border-2 border-pink-300 rounded-full shadow
                             flex items-center justify-center gap-2
                             hover:scale-105 transition-transform
                             animate-[orbit_7.2s_linear_infinite]"
                  aria-label="Open sorry note"
                  title="Open sorry note"
                >
                  <span className="text-pink-600">✈️</span>
                  <span className="text-pink-700 font-semibold">sorry note</span>
                </button>
              </div>
            </header>

            <main className="container mx-auto px-4 pb-20 z-10 relative">
              {/* Letter Section */}
              <section className="mb-16 max-w-2xl mx-auto">
                <div
                  className="bg-white rounded-lg p-8 shadow-lg transform rotate-1 relative"
                  style={{
                    backgroundImage: "url('https://www.transparenttextures.com/patterns/lined-paper.png')",
                  }}
                >
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-yellow-300 rounded-full shadow-md transform -rotate-12"></div>
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-blue-300 rounded-full shadow-md transform rotate-12"></div>

                  <h2 className="text-3xl font-handwriting text-pink-700 mb-6 animate-fade-in">
                    {name},
                  </h2>

                  <div className="space-y-4 font-handwriting text-lg text-gray-700">
                    <p className="animate-fade-in animation-delay-100">
                      I wanted to take a moment to say how truly sorry I am. Sometimes words come out wrong,
                      actions don't match intentions, and feelings get hurt along the way.
                    </p>
                    <p className="animate-fade-in animation-delay-200">
                      You mean the world to me, and the last thing I ever want to do is cause you pain.
                      I've been reflecting on what happened, and I realize now how my actions affected you.
                    </p>
                    <p className="animate-fade-in animation-delay-300">
                      I promise to do better, to listen more, and to be the person you deserve. Our relationship
                      is too important to let misunderstandings come between us.
                    </p>
                    {/* Your custom line with emojis */}
                    <p className="animate-fade-in animation-delay-350">
                      Sorry once again, and haa sorry need change — I know you will see soon. Toh kya bolti tu cutie? 🥺💕
                    </p>
                    <p className="animate-fade-in animation-delay-400 font-bold">
                      With all my heart,
                    </p>
                    <p className="animate-fade-in animation-delay-500 font-bold text-xl text-pink-600">
                      Me
                    </p>
                  </div>

                  <div className="absolute -right-2 top-1/3 transform rotate-12">
                    <Heart size={24} fill="#f472b6" stroke="#f472b6" className="animate-pulse" />
                  </div>
                  <div className="absolute -left-2 bottom-1/4 transform -rotate-12">
                    <Heart size={20} fill="#f472b6" stroke="#f472b6" className="animate-pulse" />
                  </div>
                </div>
              </section>

              {/* Ribbon of hearts reveal */}
              <section aria-hidden className="relative mx-auto max-w-2xl my-6">
                <div className="pointer-events-none select-none">
                  <div className="absolute -left-10 -right-10 h-10 opacity-0 animate-[ribbonIn_900ms_ease_200ms_forwards]">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient( 45deg, transparent 0 24px, rgba(244,114,182,0.18) 24px 48px )',
                      }}
                    />
                  </div>
                  <div className="absolute -left-6 -right-6 top-0 flex gap-2 justify-center opacity-0 animate-[fadeIn_600ms_ease_400ms_forwards]">
                    <span>💖</span><span>💗</span><span>💞</span><span>💕</span><span>💝</span>
                  </div>
                </div>
              </section>

              {/* Circular Photo Gallery with center Surprise Box */}
              <section className="mb-12">
                <h2 className="text-3xl font-comic text-pink-700 mb-6 text-center">Our Memories</h2>
                <PhotoGallery
                  onOpenSurprise={() => {
                    setAnswer(null);
                    setShowQuestion(true);
                  }}
                  onFlip={(_, active) => active && bumpInteractions(1)}
                />
              </section>

              {/* Interactive Game */}
              <section className="mb-16">
                <h2 className="text-3xl font-comic text-pink-700 mb-6 text-center">Pop Some Hearts!</h2>
                <p className="text-center text-gray-600 mb-4">
                  Click on 5 hearts to reveal a special message
                </p>
                <HeartGame
                  onProgress={() => bumpInteractions(1)}
                  onComplete={() => bumpInteractions(3)}
                />
              </section>

              {/* Secret memory unlock */}
              {showMemory && (
                <section className="mt-8 flex justify-center">
                  <div className="bg-white border-4 border-black rounded-2xl p-5 shadow transform rotate-1 animate-[fadeIn_420ms_ease_forwards]">
                    <p className="font-handwriting text-xl text-gray-800">
                      Secret memory unlocked: the best part of my day is any part with you. 🌷
                    </p>
                  </div>
                </section>
              )}

              {/* Final apology line */}
              <section className="mt-14 text-center">
                <p className="font-handwriting text-2xl text-pink-700">
                  P.S. Sorry once again see you soon. take care 💗
                </p>
              </section>
            </main>

            <footer className="bg-pink-100 py-6 text-center text-pink-600 font-comic">
              <p>Made with ❤️ just for you</p>
            </footer>

            {/* Corner hug sticker */}
            {cornerSticker && (
              <div
                className="fixed z-[55] bottom-4 right-4 select-none"
                style={{ transform: 'rotate(-15deg)' }}
                aria-hidden
                title="Hug sent"
              >
                <div className="inline-flex items-center gap-1 bg-white border-2 border-black rounded-xl px-3 py-1 shadow">
                  <span>💗</span>
                  <span className="font-comic text-pink-700">hug pinned</span>
                </div>
              </div>
            )}
          </div>

          {/* Backdrop (click to close) */}
          {showSticky && (
            <div
              className="fixed inset-0 z-[60] bg-black/30"
              onClick={() => setShowSticky(false)}
              aria-hidden
            />
          )}

          {/* Anchored sticky note */}
          {showSticky && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed z-[61]"
              style={{ top: stickyPos.top, left: stickyPos.left, width: 280 }}
            >
              <div
                className="relative rounded-xl border-4 border-black shadow-xl"
                style={{
                  background: '#fff8dc',
                  transform: 'rotate(-2deg)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowSticky(false)}
                  className="absolute -top-3 -right-3 bg-white border-2 border-black rounded-full w-8 h-8 shadow"
                  aria-label="Close"
                >
                  ×
                </button>

                {/* Arrow pointer */}
                <span
                  aria-hidden
                  className={[
                    'absolute w-4 h-4 bg-[#fff8dc] border-2 border-black',
                    stickyPos.placement === 'right' ? 'left-[-10px] top-1/2 -translate-y-1/2 rotate-45 border-t-0 border-r-0' : '',
                    stickyPos.placement === 'left' ? 'right-[-10px] top-1/2 -translate-y-1/2 rotate-45 border-b-0 border-l-0' : '',
                    stickyPos.placement === 'bottom' ? 'top-[-10px] left-1/2 -translate-x-1/2 rotate-45 border-l-0 border-t-0' : '',
                    stickyPos.placement === 'top' ? 'bottom-[-10px] left-1/2 -translate-x-1/2 rotate-45 border-r-0 border-b-0' : '',
                  ].join(' ')}
                />

                {/* Content */}
                <div className="p-4">
                  <div className="text-4xl leading-none mb-1">📝</div>
                  <p className="font-handwriting text-lg text-gray-800">
                   My sweet kaju katli please accept my sorry ? 🫶
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        placeCornerSticker();
                        setShowSticky(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-pink-500 text-white font-semibold border-2 border-black shadow hover:bg-pink-600"
                    >
                      Send hug to your cutoo💌
                    </button>
                   
                  </div>

                  {/* Doodles */}
                  <div className="absolute -left-2 -bottom-2 text-pink-500 text-3xl select-none" aria-hidden>❤</div>
                  <div className="absolute -right-1 -top-1 text-yellow-400 text-2xl select-none" aria-hidden>★</div>
                </div>
              </div>
            </div>
          )}

          {/* Modal layer */}
          {showQuestion && (
            <QuestionModal
              imageSrc={askImg}
              answer={answer}
              onAnswer={(a) => {
                setAnswer(a);
                if (a === 'yess') {
                  setCornerSticker(true); // bonus: pin hug if she says yes
                }
              }}
              onClose={() => setShowQuestion(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
