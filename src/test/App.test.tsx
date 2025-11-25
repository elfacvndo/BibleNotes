import { render, screen } from '@testing-library/react';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the main application layout', () => {
    render(<App />);

    // Check for a key element from each part of the layout
    expect(screen.getByText('Aggiungi Slide')).toBeInTheDocument();
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Benvenuto!')).toBeInTheDocument();
  });
});
