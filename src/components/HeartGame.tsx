import React, { useState, useEffect } from 'react';
import { Heart, RefreshCw, HelpCircle, Gift, Star } from 'lucide-react';

const HeartGame: React.FC = () => {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number; direction: number; type: string }>>([]);
  const [popped, setPopped] = useState<number[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [powerUps, setPowerUps] = useState<number[]>([]);
  const [checkpoints, setCheckpoints] = useState<number[]>([]);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [showCheckpointMessage, setShowCheckpointMessage] = useState(false);

  // Tutorial steps
  const tutorialSteps = [
    "Welcome to the Heart Popping Game! Click on hearts to pop them.",
    "You need to pop 5 hearts to reveal a special message.",
    "Look for special power-up hearts that count as 2 pops!",
    "The game gets slightly more challenging as you progress.",
    "Let's start with an easy level. Click 'Start Game' when you're ready!"
  ];
  const [tutorialStep, setTutorialStep] = useState(0);

  useEffect(() => {
    if (gameStarted && !showTutorial) {
      // Create hearts based on difficulty
      const heartCount = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 12 : 10;
      const speedFactor = difficulty === 'easy' ? 0.3 : difficulty === 'medium' ? 0.5 : 0.8;
      
      // Create hearts
      const newHearts = Array.from({ length: heartCount }, (_, i) => {
        // Add power-up hearts (10% chance)
        const isPowerUp = Math.random() < 0.1;
        
        return {
          id: i,
          x: Math.random() * 80 + 10, // percentage
          y: Math.random() * 80 + 10, // percentage
          size: Math.random() * 20 + 30, // px
          speed: (Math.random() * 0.5 + 0.3) * speedFactor, // speed factor
          direction: Math.random() > 0.5 ? 1 : -1, // direction
          type: isPowerUp ? 'power-up' : 'normal'
        };
      });
      
      setHearts(newHearts);
      
      // Set checkpoints
      setCheckpoints([1, 3, 5]);
      
      // Animation frame for moving hearts
      let animationId: number;
      let lastTime = 0;
      
      const animate = (time: number) => {
        if (!lastTime) lastTime = time;
        const delta = time - lastTime;
        lastTime = time;
        
        setHearts(prevHearts => 
          prevHearts.map(heart => {
            // Move heart in a slight wave pattern
            const newY = heart.y + Math.sin(time / 1000) * 0.2 * heart.speed;
            const newX = heart.x + (Math.cos(time / 1500) * 0.3 * heart.speed * heart.direction);
            
            // Bounce off edges
            let newDirection = heart.direction;
            if (newX > 90 || newX < 10) {
              newDirection = -heart.direction;
            }
            
            return {
              ...heart,
              x: Math.max(5, Math.min(95, newX)),
              y: Math.max(5, Math.min(95, newY)),
              direction: newDirection
            };
          })
        );
        
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
      
      return () => {
        cancelAnimationFrame(animationId);
      };
    }
  }, [gameStarted, showTutorial, difficulty]);

  useEffect(() => {
    // Check for checkpoints
    const totalPops = popped.length + powerUps.length;
    
    if (checkpoints.includes(totalPops) && totalPops > currentCheckpoint) {
      setCurrentCheckpoint(totalPops);
      setShowCheckpointMessage(true);
      
      // Hide checkpoint message after 2 seconds
      setTimeout(() => {
        setShowCheckpointMessage(false);
      }, 2000);
    }
    
    // Check for win condition
    if (totalPops >= 5 && !showMessage) {
      setShowMessage(true);
    }
  }, [popped, powerUps, checkpoints, currentCheckpoint]);

  const popHeart = (id: number, type: string) => {
    if (!popped.includes(id)) {
      setPopped([...popped, id]);
      
      // If it's a power-up heart, count it as 2
      if (type === 'power-up') {
        setPowerUps([...powerUps, id]);
      }
    }
  };

  const resetGame = () => {
    setPopped([]);
    setPowerUps([]);
    setShowMessage(false);
    setCurrentCheckpoint(0);
    setShowCheckpointMessage(false);
    setGameStarted(true);
  };

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      setGameStarted(true);
    }
  };

  const startTutorial = () => {
    setShowTutorial(true);
    setTutorialStep(0);
  };

  const changeDifficulty = (level: string) => {
    setDifficulty(level);
    resetGame();
  };

  // Calculate total pops (regular + power-ups)
  const totalPops = popped.length + powerUps.length;

  return (
    <div className="relative bg-pink-50 rounded-xl p-4 shadow-lg h-[450px] overflow-hidden border-4 border-pink-300">
      {!gameStarted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h3 className="text-2xl font-comic text-pink-600 mb-6">Heart Popping Game</h3>
          
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => startTutorial()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95 flex items-center"
            >
              <HelpCircle size={20} className="mr-2" />
              Tutorial
            </button>
            
            <button
              onClick={() => setGameStarted(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95"
            >
              Start Game
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-comic text-pink-600 mb-2">Choose Difficulty:</h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => setDifficulty('easy')}
                className={`px-4 py-2 rounded-full ${difficulty === 'easy' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                Easy
              </button>
              <button 
                onClick={() => setDifficulty('medium')}
                className={`px-4 py-2 rounded-full ${difficulty === 'medium' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              >
                Medium
              </button>
              <button 
                onClick={() => setDifficulty('hard')}
                className={`px-4 py-2 rounded-full ${difficulty === 'hard' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
              >
                Hard
              </button>
            </div>
          </div>
        </div>
      ) : showTutorial ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md transform rotate-1 relative">
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-300 rounded-full"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-blue-200 rounded-full"></div>
            
            <h3 className="text-xl font-comic text-blue-700 mb-4">Tutorial: Step {tutorialStep + 1}</h3>
            
            <div className="speech-bubble relative bg-blue-50 p-4 rounded-lg mb-6">
              <p className="font-comic text-gray-700">
                {tutorialSteps[tutorialStep]}
              </p>
            </div>
            
            {/* Tutorial illustration */}
            <div className="flex justify-center mb-6">
              {tutorialStep === 0 && <Heart size={40} fill="#f472b6" stroke="#f472b6" className="animate-pulse" />}
              {tutorialStep === 1 && (
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Heart key={i} size={24} fill="#f472b6" stroke="#f472b6" />
                  ))}
                </div>
              )}
              {tutorialStep === 2 && (
                <div className="flex items-center space-x-2">
                  <Heart size={30} fill="#f472b6" stroke="#f472b6" />
                  <span className="font-bold text-xl">=</span>
                  <div className="flex">
                    <Heart size={20} fill="#f472b6" stroke="#f472b6" />
                    <Heart size={20} fill="#f472b6" stroke="#f472b6" />
                  </div>
                </div>
              )}
              {tutorialStep === 3 && <RefreshCw size={40} className="text-pink-500" />}
              {tutorialStep === 4 && <Star size={40} fill="#f472b6" stroke="#f472b6" />}
            </div>
            
            <button
              onClick={nextTutorialStep}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md transform transition-all hover:scale-105 active:scale-95 mx-auto block"
            >
              {tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Start Game'}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md z-20">
            <span className="font-comic text-pink-600">Hearts Popped: {totalPops}/5</span>
          </div>
          
          <div className="absolute top-4 right-4 flex space-x-2 z-20">
            <button
              onClick={() => changeDifficulty(difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy')}
              className={`bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all transform hover:rotate-12
                        ${difficulty === 'easy' ? 'text-green-500' : difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}
              aria-label="Change difficulty"
            >
              <Star size={20} />
            </button>
            
            <button
              onClick={resetGame}
              className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all transform hover:rotate-12"
              aria-label="Restart game"
            >
              <RefreshCw size={20} className="text-pink-500" />
            </button>
          </div>
          
          {/* Visual cues for progress */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md z-20">
            <div className="flex space-x-2">
              {checkpoints.map((checkpoint, index) => (
                <div 
                  key={index}
                  className={`w-4 h-4 rounded-full ${totalPops >= checkpoint ? 'bg-pink-500' : 'bg-gray-300'}`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Checkpoint message */}
          {showCheckpointMessage && (
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-100 px-4 py-2 rounded-lg shadow-md z-30 border-2 border-yellow-400 animate-bounce-slow">
              <p className="font-comic text-yellow-800">Checkpoint reached! Progress saved!</p>
            </div>
          )}
          
          {hearts.map(heart => (
            <button
              key={heart.id}
              onClick={() => popHeart(heart.id, heart.type)}
              className={`absolute transform transition-all ${
                popped.includes(heart.id) 
                  ? 'opacity-0 scale-150' 
                  : 'hover:scale-110 active:scale-90'
              }`}
              style={{
                left: `${heart.x}%`,
                top: `${heart.y}%`,
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                transition: 'transform 0.2s, opacity 0.3s',
                filter: heart.type === 'power-up' ? 'drop-shadow(0 0 5px gold)' : 'none',
              }}
              aria-label="Pop heart"
            >
              <Heart 
                fill={heart.type === 'power-up' ? '#ffd700' : '#f472b6'} 
                stroke={heart.type === 'power-up' ? '#ffd700' : '#f472b6'} 
                size={heart.size} 
                className={popped.includes(heart.id) ? 'animate-pop' : 'animate-pulse'} 
              />
              {heart.type === 'power-up' && !popped.includes(heart.id) && (
                <div className="absolute -top-2 -right-2 bg-yellow-300 rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold border border-yellow-500">
                  2x
                </div>
              )}
              {popped.includes(heart.id) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-sparkle">✨</div>
                </div>
              )}
            </button>
          ))}
          
          {showMessage && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white rounded-2xl p-6 shadow-xl max-w-md transform rotate-2 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-pink-300 rounded-full"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-pink-200 rounded-full"></div>
                
                <div className="speech-bubble relative bg-pink-100 p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-comic text-pink-700 mb-2">You Did It!</h3>
                  <p className="font-handwriting text-gray-700">
                    Just like you popped these hearts, you've touched mine in so many ways. 
                    Thank you for being you, and for giving me a chance to make things right.
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={resetGame}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-md transform transition-all hover:scale-105 active:scale-95"
                  >
                    Play Again
                  </button>
                  
                  <button
                    onClick={() => changeDifficulty(difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md transform transition-all hover:scale-105 active:scale-95 flex items-center"
                  >
                    <Star size={16} className="mr-1" />
                    {difficulty === 'easy' ? 'Try Medium' : difficulty === 'medium' ? 'Try Hard' : 'Try Easy'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HeartGame;