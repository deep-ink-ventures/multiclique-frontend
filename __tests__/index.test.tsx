import Index from '@/pages/index';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('Index component', () => {
  it('should render without crashing', () => {
    render(<Index />);

    expect(screen.getByText("Help, I don't have a wallet")).toBeInTheDocument();
  });
});
