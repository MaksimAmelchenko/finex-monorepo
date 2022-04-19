import { render } from '@testing-library/react';

import { Option } from './checkbox';

describe('Checkbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Option label="Checkbox" />);
    expect(baseElement).toBeTruthy();
  });
});
