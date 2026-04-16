import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders mortgage calculator heading', () => {
  render(<App />);
  expect(screen.getByText(/mortgage calculator/i)).toBeInTheDocument();
});

test('renders calculate button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /calculate my mortgage/i })).toBeInTheDocument();
});

test('shows validation error for invalid loan amount', () => {
  render(<App />);

  const loanAmountInput = screen.getByRole('spinbutton', { name: /loan amount/i });
  fireEvent.change(loanAmountInput, { target: { value: '0' } });
  fireEvent.click(screen.getByRole('button', { name: /calculate my mortgage/i }));

  expect(
    screen.getByText(/please correct the highlighted fields and try again/i),
  ).toBeInTheDocument();
  expect(screen.getByText(/loan amount must be between/i)).toBeInTheDocument();
});
