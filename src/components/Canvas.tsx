import React, { useState, MouseEvent, useEffect } from 'react';
import { Slide, SlideElement } from '../types';

interface CanvasProps {
  slide: Slide | undefined;
  onUpdateElementPosition: (slideId: string, elementId: string, x: number, y: number) => void;
}

const Canvas: React.FC<CanvasProps> = ({ slide, onUpdateElementPosition }) => {
  const [draggingElement, setDraggingElement] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, element: SlideElement) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggingElement({
      id: element.id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    if (!draggingElement || !slide) return;

    const canvasElement = document.querySelector('.canvas');
    if(!canvasElement) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      const canvasRect = canvasElement.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - draggingElement.offsetX;
      const newY = e.clientY - canvasRect.top - draggingElement.offsetY;
      onUpdateElementPosition(slide.id, draggingElement.id, newX, newY);
    };

    const handleMouseUp = () => {
      setDraggingElement(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingElement, slide, onUpdateElementPosition]);

  if (!slide) {
    return <div className="canvas">Seleziona una slide per iniziare.</div>;
  }

  return (
    <div
      className="canvas"
      style={{ position: 'relative' }} // Needed for absolute positioning of children
    >
      {slide.elements.map((element) => (
        <div
          key={element.id}
          onMouseDown={(e) => handleMouseDown(e, element)}
          style={{
            position: 'absolute',
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            border: '1px solid #ccc',
            padding: '5px',
            cursor: 'move',
            userSelect: 'none', // Prevent text selection while dragging
          }}
        >
          {element.content}
        </div>
      ))}
    </div>
  );
};

export default Canvas;
