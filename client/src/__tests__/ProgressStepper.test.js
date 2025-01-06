import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProgressStepper from '../components/ProgressStepper';

test('renders steps correctly', () => {
  const steps = ['Step 1', 'Step 2', 'Step 3'];
  const stepContent = [
    <div key="step1">Content for Step 1</div>,
    <div key="step2">Content for Step 2</div>,
    <div key="step3">Content for Step 3</div>,
  ];

  render(<ProgressStepper steps={steps} stepContent={stepContent} />);

  steps.forEach(step => {
    expect(screen.getByText(step)).toBeInTheDocument();
  });
});

test('changes active step when clicking Next and Back buttons', () => {
    const steps = ['Step 1', 'Step 2', 'Step 3'];
    const stepContent = [
      <div key="step1">Content for Step 1</div>,
      <div key="step2">Content for Step 2</div>,
      <div key="step3">Content for Step 3</div>,
    ];
  
    render(<ProgressStepper steps={steps} stepContent={stepContent} />);
  
    // Sprawdzenie, że domyślny krok to pierwszy
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  
    // Symulowanie kliknięcia Next
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  
    // Symulowanie kliknięcia Back
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
});
  
test('disables Next button when canProceedToNextStep is false', () => {
    const steps = ['Step 1'];
    const stepContent = [<div key="step1">Content for Step 1</div>]; // Dodano zawartość kroku
    
    render(<ProgressStepper steps={steps} stepContent={stepContent} />);
  
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled(); // Sprawdzenie, czy przycisk jest wyłączony
});
  
  