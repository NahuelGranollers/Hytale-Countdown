import React from 'react';
import { Home, Globe } from 'lucide-react';
import { Translation } from '../types';

interface NavbarProps {
  t: Translation;
  lang: string;
  toggleLang: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ t, lang, toggleLang }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-colors duration-300 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 bg-black/30 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10">
            <a href="https://hytale.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#00bcf2] transition-colors">
                <Home size={18} />
            </a>
            {[
                { label: t.nav.blog, url: "https://hytale.com/news" }, 
                { label: t.nav.media, url: "https://hytale.com/media" }, 
                { label: t.nav.game, url: "https://hytale.com/game" }, 
            ].map((link) => (
              <a 
                key={link.label}
                href={link.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="font-display font-bold text-xs tracking-widest text-gray-300 hover:text-white hover:shadow-[0_0_10px_white] transition-all uppercase"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          {/* Mobile Home Icon (Visible only on mobile) */}
          <div className="md:hidden flex items-center bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full border border-white/10">
             <a href="https://hytale.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#00bcf2]">
                <Home size={16} />
            </a>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10">
            {/* Language Toggle */}
            <div className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition-colors" onClick={toggleLang}>
                <Globe size={14} />
                <span className="font-display font-bold text-[10px] md:text-xs tracking-wider">{lang === 'en' ? 'ESP' : 'ENG'}</span>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;