export interface Presentation {
  id: string;
  name: string;
  slides: Slide[];
}

export interface Slide {
  id: string;
  elements: SlideElement[];
}

export interface SlideElement {
  id: string;
  type: 'text'; // Per ora, supportiamo solo elementi di testo
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
