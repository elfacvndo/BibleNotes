import React from 'react';
import { Slide } from '../types';

interface SidebarProps {
  slides: Slide[];
  selectedSlideId: string | null;
  onSelectSlide: (slideId: string) => void;
  onDeleteSlide: (slideId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ slides, selectedSlideId, onSelectSlide, onDeleteSlide }) => {
  return (
    <div className="sidebar">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide-thumbnail ${selectedSlideId === slide.id ? 'selected' : ''}`}
          onClick={() => onSelectSlide(slide.id)}
        >
          Slide {index + 1}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSlide(slide.id);
            }}
          >
            Elimina
          </button>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
