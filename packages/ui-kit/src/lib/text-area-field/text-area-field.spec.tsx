import { render } from '@testing-library/react';

import { TextAreaField } from './text-field';

describe('TextField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TextAreaField />);
    expect(baseElement).toBeTruthy();
  });
});
