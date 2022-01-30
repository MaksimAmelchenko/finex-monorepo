import { render } from '@testing-library/react';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Checkbox label="Checkbox" />);
    expect(baseElement).toBeTruthy();
  });
});
