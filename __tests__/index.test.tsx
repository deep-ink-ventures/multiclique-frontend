import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';

import Index from '@/pages/index';

describe('Index component', () => {
  it('should render without crashing', () => {
    render(<Index />);

    expect(screen.getByText("Help, I don't have a wallet")).toBeInTheDocument();
  });
});
