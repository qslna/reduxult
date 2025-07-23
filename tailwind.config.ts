import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base system colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        
        // 2025 Fashion Trend Colors
        fashion: {
          // Pantone 2025 Color of the Year
          mocha: {
            50: '#FAF9F7',
            100: '#F5F2EE',
            200: '#E8E3DC',
            300: '#D4CCC5', // warm accent
            400: '#C4B8AE',
            500: '#B7AFA3', // primary mocha
            600: '#9A9086', // deep accent
            700: '#7D756C',
            800: '#605B53',
            900: '#434139'
          },
          // Digital Lime - Tech-influenced fresh green
          lime: {
            50: '#F7FFF0',
            100: '#ECFFE0',
            200: '#D9FFC2',
            300: '#C1FF95',
            400: '#A3FF60',
            500: '#82FF25', // primary digital lime
            600: '#6EE015',
            700: '#58B008',
            800: '#468A0A',
            900: '#3B720F'
          },
          // Neo-Mint - Fresh, modern mint
          mint: {
            50: '#F0FFFE',
            100: '#CCFFFE',
            200: '#99FFFD',
            300: '#5EFCFA',
            400: '#22E9E5',
            500: '#06CCC7', // primary neo-mint
            600: '#059FA3',
            700: '#0A7D83',
            800: '#0E656A',
            900: '#125459'
          },
          // Electric Blue - Bold, energetic
          electric: {
            50: '#EFF8FF',
            100: '#DAECFF',
            200: '#BCDDFF',
            300: '#8AC8FF',
            400: '#51A8FF',
            500: '#2882FF', // primary electric blue
            600: '#1A5CFF',
            700: '#1E47EA',
            800: '#1F3ABD',
            900: '#1E3494'
          },
          // Terracotta - Earthy, sophisticated
          terracotta: {
            50: '#FDF4F2',
            100: '#FCE7E2',
            200: '#F9D3CA',
            300: '#F4B7A6',
            400: '#ED9179',
            500: '#E26B52', // primary terracotta
            600: '#D0513A',
            700: '#AF4130',
            800: '#91382C',
            900: '#78332A'
          },
          // Lavender Gray - Soft, calming
          lavender: {
            50: '#F8F7FB',
            100: '#F1EEF6',
            200: '#E6E0EF',
            300: '#D2C7E2',
            400: '#B8A8D1',
            500: '#9B85BE', // primary lavender gray
            600: '#8169A8',
            700: '#6B5590',
            800: '#594776',
            900: '#4A3C61'
          },
          // Honey Gold - Warm, luxurious
          honey: {
            50: '#FFFBEB',
            100: '#FFF3C6',
            200: '#FFE688',
            300: '#FFD449',
            400: '#FFC220',
            500: '#F9A007', // primary honey gold
            600: '#DD7A02',
            700: '#B75506',
            800: '#94420C',
            900: '#7A360D'
          },
          // Peach Fuzz variations (continuing from 2024)
          peach: {
            50: '#FFF7F3',
            100: '#FFEDE5',
            200: '#FFD9CC',
            300: '#FFBFA8',
            400: '#FF9873',
            500: '#FF6B35', // primary peach
            600: '#F04A1C',
            700: '#C73414',
            800: '#9E2C16',
            900: '#7F2A18'
          }
        },
        
        // Professional fashion grays
        neutral: {
          0: '#FFFFFF',
          50: '#F8F8F8',
          100: '#F0F0F0',
          200: '#E8E8E8',
          300: '#D0D0D0',
          400: '#A0A0A0',
          500: '#707070',
          600: '#505050',
          700: '#303030',
          800: '#202020',
          900: '#101010',
          950: '#000000'
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'glitch-1': 'glitch-1 0.5s infinite',
        'glitch-2': 'glitch-2 0.5s infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'glitch-1': {
          '0%, 14%, 15%, 49%, 50%, 99%, 100%': { transform: 'translate(0)' },
          '15%, 49%': { transform: 'translate(-2px, -1px)' }
        },
        'glitch-2': {
          '0%, 20%, 21%, 62%, 63%, 99%, 100%': { transform: 'translate(0)' },
          '21%, 62%': { transform: 'translate(2px, 1px)' }
        },
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'noise-pattern': `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.1) 2px, rgba(0,0,0,.1) 4px), repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)`,
      },
      fontFamily: {
        'display': ['Orbitron', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      },
      backdropBlur: {
        'glass': 'var(--glass-blur)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config