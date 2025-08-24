import React, { useMemo, useState } from 'react';
import { Heart, X } from 'lucide-react';
import HeartGame from './components/HeartGame';
import PhotoGallery from './components/PhotoGallery';
import './EnvelopeAnimation.css';
import askImg from './assets/img1.jpg';

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
  // Playful "nahh" behavior: runs away on hover, flips to "yess" on first click, second click confirms "yess"
  const [nahhFlipped, setNahhFlipped] = useState(false);
  const [nahhOffset, setNahhOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const onNahhHover = () => {
    if (nahhFlipped) return; // stop running once flipped
    const rx = (Math.random() * 2 - 1) * 40; // -40..40 px
    const ry = (Math.random() * 2 - 1) * 18; // -18..18 px
    setNahhOffset({ x: rx, y: ry });
  };

  const onNahhClick = () => {
    if (!nahhFlipped) {
      setNahhFlipped(true);       // first click: flip to yess
      setNahhOffset({ x: 0, y: 0 }); // bring it back nicely
    } else {
      onAnswer('yess');           // second click: confirm yess
    }
  };

  // Floating heart confetti
  const hearts = useMemo(
    () =>
      Array.from({ length: 10 }).map(() => ({
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 65}%`,
        delay: `${Math.random() * 1.2}s`,
        size: 12 + Math.floor(Math.random() * 10), // 12..21
        opacity: 0.15 + Math.random() * 0.2,
      })),
    []
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-title"
    >
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Close */}
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Confetti hearts */}
        <div className="absolute inset-0 pointer-events-none">
          {hearts.map((h, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: h.left,
                top: h.top,
                animationDelay: h.delay,
                opacity: h.opacity,
              }}
            >
              <Heart size={h.size} color="#f472b6" />
            </div>
          ))}
        </div>

        {/* Image */}
        <img src={imageSrc} alt="Cute ask" className="w-full h-56 object-cover" loading="lazy" />

        {/* Sticker row */}
        <div className="flex items-center justify-center gap-2 py-2 text-xl">
          <span>✨</span>
          <span>🐾</span>
          <span>🧸</span>
          <span>🌸</span>
          <span>🍓</span>
        </div>

        <div className="px-5 pb-5 pt-2 relative">
          {/* Title + badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <h3 id="question-title" className="text-xl font-semibold text-gray-800 text-center">
              Can we go out?
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold px-2 py-1 animate-bounce">
              <Heart size={14} className="text-pink-500" />
              cute
            </span>
          </div>

          {/* Subtitle */}
          {answer === null && (
            <p className="text-center text-pink-600 text-sm mb-4">
              Pretty please? (๑˃ᴗ˂)ﻭ ✧
            </p>
          )}

          {/* Choices */}
          {answer === null && (
            <div className="flex gap-3 justify-center relative">
              {/* yess with sparkles */}
              <div className="relative">
                <button
                  onClick={() => onAnswer('yess')}
                  className="px-5 py-2.5 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300 transition-colors"
                >
                  yess
                </button>
                <span className="pointer-events-none absolute -top-2 -right-2 text-pink-400 animate-ping">✦</span>
                <span className="pointer-events-none absolute -bottom-2 -left-2 text-pink-400 animate-ping">✧</span>
              </div>

              {/* nahh playful */}
              <button
                onMouseEnter={onNahhHover}
                onClick={onNahhClick}
                className={`px-5 py-2.5 rounded-full font-semibold shadow transition
                            focus:outline-none 
                            ${nahhFlipped
                              ? 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-4 focus:ring-pink-300'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300'}`}
                style={{
                  transform: `translate(${nahhOffset.x}px, ${nahhOffset.y}px)`,
                  transition: 'transform 200ms ease',
                }}
                title={nahhFlipped ? 'hehe 😸' : undefined}
              >
                {nahhFlipped ? 'yess' : 'nahh'}
              </button>
            </div>
          )}

          {/* Result states */}
          {answer === 'yess' && (
            <div className="text-center mt-2">
              <h4 className="text-xl font-semibold text-pink-600 mb-2">Yay! 💖</h4>
              <p className="text-gray-700">Let’s plan it. I’ll text the details.</p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300"
              >
                Close
              </button>
            </div>
          )}

          {answer === 'nahh' && (
            <div className="text-center mt-2">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Aww… 🥺</h4>
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

  React.useEffect(() => {
    const overlayActive = showEnvelope || showQuestion;
    if (overlayActive) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [showEnvelope, showQuestion]);

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
            <header className="relative pt-16 pb-8 text-center z-10">
              <h1 className="text-5xl md:text-7xl font-bold text-pink-600 animate-bounce-slow inline-block relative">
                I'm Sorry {name}
                <span className="absolute -top-6 -right-6 animate-float-delay">
                  <Heart size={30} fill="#f472b6" stroke="#f472b6" />
                </span>
                <span className="absolute -bottom-4 -left-6 animate-float">
                  <Heart size={24} fill="#f472b6" stroke="#f472b6" />
                </span>
              </h1>
            </header>

            <main className="container mx-auto px-4 pb-20 z-10 relative">
              {/* Letter Section */}
              <section className="mb-16 max-w-2xl mx-auto">
                <div
                  className="bg-white rounded-lg p-8 shadow-lg transform rotate-1 relative"
                  style={{
                    backgroundImage:
                      "url('https://www.transparenttextures.com/patterns/lined-paper.png')",
                  }}
                >
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-yellow-300 rounded-full shadow-md transform -rotate-12"></div>
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-blue-300 rounded-full shadow-md transform rotate-12"></div>

                  <h2 className="text-3xl font-handwriting text-pink-700 mb-6 animate-fade-in">
                    {name},
                  </h2>

                  <div className="space-y-4 font-handwriting text-lg text-gray-700">
                    <p className="animate-fade-in animation-delay-100">
                      I wanted to take a moment to say how truly sorry I am.
                      Sometimes words come out wrong, actions don't match
                      intentions, and feelings get hurt along the way.
                    </p>
                    <p className="animate-fade-in animation-delay-200">
                      You mean the world to me, and the last thing I ever want
                      to do is cause you pain. I've been reflecting on what
                      happened, and I realize now how my actions affected you.
                    </p>
                    <p className="animate-fade-in animation-delay-300">
                      I promise to do better, to listen more, and to be the
                      person you deserve. Our relationship is too important to
                      let misunderstandings come between us.
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

              {/* Circular Photo Gallery with center Surprise Box */}
              <section className="mb-12">
                <h2 className="text-3xl font-comic text-pink-700 mb-6 text-center">Our Memories</h2>
                <PhotoGallery
                  onOpenSurprise={() => {
                    setAnswer(null);
                    setShowQuestion(true);
                  }}
                />
              </section>

              {/* Interactive Game */}
              <section className="mb-16">
                <h2 className="text-3xl font-comic text-pink-700 mb-6 text-center">Pop Some Hearts!</h2>
                <p className="text-center text-gray-600 mb-4">
                  Click on 5 hearts to reveal a special message
                </p>
                <HeartGame />
              </section>
            </main>

            <footer className="bg-pink-100 py-6 text-center text-pink-600 font-comic">
              <p>Made with ❤️ just for you</p>
            </footer>
          </div>

          {/* Modal layer */}
          {showQuestion && (
            <QuestionModal
              imageSrc={askImg}
              answer={answer}
              onAnswer={(a) => setAnswer(a)}
              onClose={() => setShowQuestion(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
