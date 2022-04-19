import { render } from '@testing-library/react';

import InlineSelect from './inline-select';

describe('InlineSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InlineSelect />);
    expect(baseElement).toBeTruthy();
  });
});
