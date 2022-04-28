import { render } from '@testing-library/react';

import { SelectPopup } from './select-popup';

describe('SelectPopup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <SelectPopup label={''} options={[{ value: 'value', label: 'label' }]} onChange={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
