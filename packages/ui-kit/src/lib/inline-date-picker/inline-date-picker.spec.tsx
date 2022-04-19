import { render } from '@testing-library/react';

import { InlineDatePicker } from './inline-date-picker';

describe('InlineSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InlineDatePicker label="Label" value={new Date()} onChange={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
