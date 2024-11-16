import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Restart Game button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Restart Game/i);
  expect(buttonElement).toBeInTheDocument();
});
