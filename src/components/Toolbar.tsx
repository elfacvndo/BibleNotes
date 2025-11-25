import React from 'react';

interface ToolbarProps {
  addSlide: () => void;
  addTextElement: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ addSlide, addTextElement }) => {
  return (
    <div className="toolbar">
      <button onClick={addSlide}>Aggiungi Slide</button>
      <button onClick={addTextElement}>Aggiungi Testo</button>
    </div>
  );
};

export default Toolbar;
