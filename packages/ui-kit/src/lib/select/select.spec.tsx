import { render } from '@testing-library/react';

import { Select } from './select';

describe('SelectPopup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Select options={[{ value: 'value', label: 'label' }]} onChange={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
