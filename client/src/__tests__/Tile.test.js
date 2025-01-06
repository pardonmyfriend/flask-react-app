import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tile from '../components/Tile';

test('renders button with correct title', () => {
  render(
    <Tile 
      title="PCA"
      info={{
          name: "Principal Component Analysis",
          description: "Reduces the dimensionality of data while retaining the most important variance, useful for visualizations and preprocessing."
      }}
      onClick={() => {}}
      algorithmName=""
      setAlgorithmName={() => {}}
      params={{}}
      setParams={() => {}}
      algorithmSelected={false}
      setAlgorithmSelected={() => {}}
      disabled={false}
    />
  );
  expect(screen.getByText('PCA')).toBeInTheDocument(); // Sprawdzamy, czy przycisk zawiera tytuł
});

test('calls onClick when button is clicked', () => {
  const mockOnClick = jest.fn(); // Mockowanie funkcji
  render(
    <Tile 
      title="PCA"
      info={{
          name: "Principal Component Analysis",
          description: "Reduces the dimensionality of data while retaining the most important variance, useful for visualizations and preprocessing."
      }}
      onClick={mockOnClick}
      algorithmName=""
      setAlgorithmName={() => {}}
      params={{}}
      setParams={() => {}}
      algorithmSelected={false}
      setAlgorithmSelected={() => {}}
      disabled={false}
    />
  );
  
  fireEvent.click(screen.getByText('PCA')); // Kliknięcie przycisku
  expect(mockOnClick).toHaveBeenCalledTimes(1); // Sprawdzamy, czy funkcja została wywołana
});

test('renders selected algorithm styles and components', () => {
    render(
      <Tile 
        title="PCA"
        info={{
          name: "Principal Component Analysis",
          description: "Reduces the dimensionality of data while retaining the most important variance, useful for visualizations and preprocessing."
      }}
        onClick={() => {}}
        algorithmName="PCA"
        setAlgorithmName={() => {}}
        params={{ n_components: 2, whiten: true }}
        setParams={() => {}}
        algorithmSelected={true}
        setAlgorithmSelected={() => {}}
        disabled={false}
      />
    );
  
    // Sprawdzanie stylu wybranego algorytmu
    const button = screen.getByText('PCA').closest('button');
    expect(button).toHaveStyle('background-color: #3FBDBD');
    expect(button).toHaveStyle('color: #fff');
  
    // Sprawdzanie, czy renderowane są parametry
    expect(screen.getByText('n_components: 2')).toBeInTheDocument();
    expect(screen.getByText('whiten: true')).toBeInTheDocument();
});

test('deselects algorithm when "Select another algorithm" is clicked', () => {
    const mockSetAlgorithmName = jest.fn();
    const mockSetParams = jest.fn();
    const mockSetAlgorithmSelected = jest.fn();
  
    render(
      <Tile 
        title="PCA"
        info={{
          name: "Principal Component Analysis",
          description: "Reduces the dimensionality of data while retaining the most important variance, useful for visualizations and preprocessing."
      }}
        onClick={() => {}}
        algorithmName="PCA"
        setAlgorithmName={mockSetAlgorithmName}
        params={{}}
        setParams={mockSetParams}
        algorithmSelected={true}
        setAlgorithmSelected={mockSetAlgorithmSelected}
        disabled={false}
      />
    );
  
    // Kliknięcie "Select another algorithm"
    fireEvent.click(screen.getByText('Select another algorithm'));
    expect(mockSetAlgorithmName).toHaveBeenCalledWith('');
    expect(mockSetParams).toHaveBeenCalledWith({});
    expect(mockSetAlgorithmSelected).toHaveBeenCalledWith(false);
});

test('button is disabled when disabled prop is true', () => {
    render(
      <Tile 
        title="PCA"
        info={{
          name: "Principal Component Analysis",
          description: "Reduces the dimensionality of data while retaining the most important variance, useful for visualizations and preprocessing."
      }}
        onClick={() => {}}
        algorithmName=""
        setAlgorithmName={() => {}}
        params={{}}
        setParams={() => {}}
        algorithmSelected={false}
        setAlgorithmSelected={() => {}}
        disabled={true}
      />
    );
  
    const button = screen.getByText('PCA').closest('button');
    expect(button).toBeDisabled();
});

test('renders tooltip with correct information', async () => {
    render(
      <Tile 
        title="PCA"
        info={{
          name: "Principal Component Analysis",
          description: "Reduces the dimensionality of data while retaining the most important variance, useful for visualizations and preprocessing."
        }}
        onClick={() => {}}
        algorithmName=""
        setAlgorithmName={() => {}}
        params={{}}
        setParams={() => {}}
        algorithmSelected={false}
        setAlgorithmSelected={() => {}}
        disabled={false}
      />
    );
  
    // Znalezienie ikony Info (tooltip trigger)
    const infoIcon = screen.getByTestId('InfoIcon');
  
    // Symulacja najechania na element
    fireEvent.mouseOver(infoIcon);
  
    // Sprawdzanie, czy tekst z tooltipa jest widoczny
    expect(await screen.findByText('Principal Component Analysis')).toBeInTheDocument();
    expect(await screen.findByText('Reduces the dimensionality of data while retaining the most important variance, useful for visualizations and preprocessing.')).toBeInTheDocument();
});
  