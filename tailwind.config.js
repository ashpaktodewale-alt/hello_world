/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        float: 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'fade-in': 'fadeIn 1s ease-in-out forwards',
        pop: 'pop 0.5s ease-out forwards',
        sparkle: 'sparkle 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        sparkle: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.5)', opacity: '1' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
      },
      // Allow arbitrary color classes for dynamic styling
      safelist: [
        {
          pattern: /bg-(yellow|blue|purple|green|red|pink)-500/,
        },
      ],
    },
  },
  plugins: [],
  // Important to ensure dynamic classes work
  safelist: [
    'bg-yellow-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-red-500',
    'bg-pink-500',
    'text-yellow-500',
    'text-blue-500',
    'text-purple-500',
    'text-green-500',
    'text-red-500',
    'text-pink-500',
  ],
};