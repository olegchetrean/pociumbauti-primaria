import React, { useState } from 'react';
import { Eye, Type, Minus, Plus } from 'lucide-react';

interface AccessibilityProps {
  onFontSizeChange: (size: 'normal' | 'large' | 'xl') => void;
  onContrastChange: (highContrast: boolean) => void;
  highContrast: boolean;
}

export const AccessibilityMenu: React.FC<AccessibilityProps> = ({ onFontSizeChange, onContrastChange, highContrast }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-r-lg shadow-lg transition-colors ${highContrast ? 'bg-yellow-400 text-black' : 'bg-moldova-blue text-white'}`}
        aria-label="Instrumente de accesibilitate"
      >
        <Eye size={24} />
      </button>

      {isOpen && (
        <div className={`absolute left-full top-0 ml-2 p-4 rounded-lg shadow-xl w-64 space-y-4 border ${highContrast ? 'bg-black text-yellow-400 border-yellow-400' : 'bg-white text-gray-800 border-gray-200'}`}>
          <h3 className="font-bold border-b pb-2">Accesibilitate</h3>
          
          <div>
            <p className="mb-2 text-sm font-semibold">Mărime text</p>
            <div className="flex gap-2">
              <button onClick={() => onFontSizeChange('normal')} className="flex-1 p-2 border rounded hover:bg-gray-100 flex justify-center"><Type size={16} /></button>
              <button onClick={() => onFontSizeChange('large')} className="flex-1 p-2 border rounded hover:bg-gray-100 flex justify-center"><Type size={20} /></button>
              <button onClick={() => onFontSizeChange('xl')} className="flex-1 p-2 border rounded hover:bg-gray-100 flex justify-center"><Type size={24} /></button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Contrast</p>
            <button 
              onClick={() => onContrastChange(!highContrast)}
              className={`w-full p-2 border rounded font-bold ${highContrast ? 'bg-yellow-400 text-black' : 'bg-black text-white'}`}
            >
              {highContrast ? 'Contrast Normal' : 'Contrast Ridicat'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};