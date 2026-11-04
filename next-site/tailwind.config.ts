import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { ink: '#17201C', muted: '#42514A', cream: '#F6F8F5', line: '#D9E3DC', emerald: '#075A43', moss: '#DDECE4', amber: '#EED7A4' },
      fontFamily: { sans: ['Inter', 'Geist', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'] },
      maxWidth: { site: '1240px' }
    }
  },
  plugins: []
};
export default config;
