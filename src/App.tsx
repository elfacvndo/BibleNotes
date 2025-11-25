import React, { useState, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { Presentation, Slide, SlideElement } from './types';
import './App.css';

const initialPresentation: Presentation = {
  id: 'pres-1',
  name: 'Presentazione di Prova',
  slides: [
    {
      id: 'slide-1',
      elements: [
        {
          id: 'elem-1',
          type: 'text',
          content: 'Benvenuto!',
          x: 50,
          y: 50,
          width: 200,
          height: 50,
        },
      ],
    },
  ],
};

const LOCAL_STORAGE_KEY = 'powerpoint-clone-presentation';

const App: React.FC = () => {
  const [presentation, setPresentation] = useState<Presentation>(() => {
    try {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialPresentation;
    } catch (error) {
      console.error('Error loading presentation from localStorage:', error);
      return initialPresentation;
    }
  });

  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(presentation.slides[0]?.id || null);

  // Save to localStorage whenever presentation changes
  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(presentation));
    } catch (error) {
      console.error('Error saving presentation to localStorage:', error);
    }
  }, [presentation]);

  // Poll for changes from other tabs/windows
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const savedPresentation = JSON.parse(saved);
          // Simple check to see if the data has changed
          if (JSON.stringify(savedPresentation) !== JSON.stringify(presentation)) {
            setPresentation(savedPresentation);
          }
        }
      } catch (error) {
        console.error('Error polling presentation from localStorage:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [presentation]);


  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      elements: [],
    };
    const newPresentation = {
      ...presentation,
      slides: [...presentation.slides, newSlide],
    };
    setPresentation(newPresentation);
    setSelectedSlideId(newSlide.id);
  };

  const deleteSlide = (slideId: string) => {
    const newSlides = presentation.slides.filter((slide) => slide.id !== slideId);
    const newPresentation = { ...presentation, slides: newSlides };
    setPresentation(newPresentation);
    if (selectedSlideId === slideId) {
      setSelectedSlideId(newSlides[0]?.id || null);
    }
  };

  const addElementToSlide = (slideId: string) => {
    if (!slideId) return;

    const newElement: SlideElement = {
      id: `elem-${Date.now()}`,
      type: 'text',
      content: 'Nuovo Testo',
      x: 10,
      y: 10,
      width: 150,
      height: 30,
    };

    const newSlides = presentation.slides.map((slide) => {
        if (slide.id === slideId) {
          return { ...slide, elements: [...slide.elements, newElement] };
        }
        return slide;
      });
    setPresentation({ ...presentation, slides: newSlides });
  };

  const updateElementPosition = (slideId: string, elementId: string, x: number, y: number) => {
     const newSlides = presentation.slides.map((slide) => {
        if (slide.id === slideId) {
          const newElements = slide.elements.map((el) => {
            if (el.id === elementId) {
              return { ...el, x, y };
            }
            return el;
          });
          return { ...slide, elements: newElements };
        }
        return slide;
      });
    setPresentation({ ...presentation, slides: newSlides });
  };

  const selectedSlide = presentation.slides.find((slide) => slide.id === selectedSlideId);

  return (
    <div className="app">
      <Toolbar addSlide={addSlide} addTextElement={() => selectedSlideId && addElementToSlide(selectedSlideId)} />
      <div className="main-content">
        <Sidebar
          slides={presentation.slides}
          selectedSlideId={selectedSlideId}
          onSelectSlide={setSelectedSlideId}
          onDeleteSlide={deleteSlide}
        />
        <Canvas slide={selectedSlide} onUpdateElementPosition={updateElementPosition} />
      </div>
    </div>
  );
};

export default App;
