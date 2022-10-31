import { render } from '@testing-library/react';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Checkbox value={true}> Checkbox </Checkbox>);
    expect(baseElement).toBeTruthy();
  });
});
