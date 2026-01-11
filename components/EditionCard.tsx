import React from 'react';

interface EditionCardProps {
  type: 'standard' | 'supporter' | 'cursebreaker';
  title: string;
  price: string;
  imagePlaceholderColor: string;
  btnText: string;
  taxText: string;
}

const EditionCard: React.FC<EditionCardProps> = ({ type, title, price, imagePlaceholderColor, btnText, taxText }) => {
  
  const getBorderColor = () => {
    switch (type) {
      case 'standard': return 'border-[#00bcf2] shadow-[0_0_20px_-5px_#00bcf250]';
      case 'supporter': return 'border-[#ffc107] shadow-[0_0_20px_-5px_#ffc10750]';
      case 'cursebreaker': return 'border-[#9c27b0] shadow-[0_0_20px_-5px_#9c27b050]';
      default: return 'border-gray-700';
    }
  };

  const getBgGradient = () => {
     switch (type) {
      case 'standard': return 'bg-card-standard';
      case 'supporter': return 'bg-card-supporter';
      case 'cursebreaker': return 'bg-card-cursebreaker';
      default: return 'bg-gray-800';
    }
  };

  const getTitleColor = () => {
      switch (type) {
      case 'standard': return 'text-[#00bcf2]';
      case 'supporter': return 'text-[#ffc107]';
      case 'cursebreaker': return 'text-[#9c27b0]';
      default: return 'text-white';
    }
  }

  return (
    <div className={`relative group w-full max-w-sm rounded-lg border-2 ${getBorderColor()} ${getBgGradient()} p-1 transition-transform hover:-translate-y-2 duration-300`}>
      {/* Inner Container */}
      <div className="bg-[#0d1016]/80 backdrop-blur-sm h-full w-full rounded p-4 flex flex-col">
        
        {/* Header */}
        <div className="text-center py-2 border-b border-white/10 mb-4">
          <h3 className={`font-display font-extrabold tracking-widest uppercase ${getTitleColor()}`}>
            {title}
          </h3>
        </div>

        {/* Image Placeholder area */}
        <div className={`w-full aspect-[3/4] rounded mb-4 overflow-hidden relative border border-white/5`}>
            {/* Using a placeholder service or css pattern */}
            <div className={`absolute inset-0 opacity-80 ${imagePlaceholderColor}`}></div>
             <img 
                src={`https://picsum.photos/400/600?random=${type === 'standard' ? 1 : type === 'supporter' ? 2 : 3}`} 
                alt={title} 
                className="w-full h-full object-cover opacity-60 mix-blend-overlay hover:opacity-100 transition-opacity duration-500"
            />
             {/* Character Silhouette Simulation */}
             <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto text-center">
            <div className="text-2xl font-display font-bold text-white mb-1">{price}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-4">{taxText}</div>
            
            <button className={`w-full py-3 rounded font-display font-bold uppercase tracking-wider text-white shadow-lg
                bg-gradient-to-b from-[#3a5b78] to-[#253b50] hover:from-[#4a6b88] hover:to-[#354b60] border border-[#5a7b98]
                transition-all active:scale-95
            `}>
                {btnText}
            </button>
        </div>

      </div>
    </div>
  );
};

export default EditionCard;