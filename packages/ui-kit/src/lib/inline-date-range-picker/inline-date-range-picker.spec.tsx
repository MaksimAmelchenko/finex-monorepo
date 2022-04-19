import { render } from '@testing-library/react';

import { InlineDateRangePicker } from './inline-date-range-picker';

describe('InlineDateRangePicker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <InlineDateRangePicker labels={['from', 'to']} values={[new Date(), new Date()]} onChange={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
