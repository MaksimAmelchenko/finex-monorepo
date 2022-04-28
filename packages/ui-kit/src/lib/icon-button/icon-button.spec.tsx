import { render } from '@testing-library/react';

import { IconButton } from './icon-button';
import { CashFlowIcon } from '@finex/ui-kit';

describe('IconButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <IconButton>
        <CashFlowIcon />
      </IconButton>
    );
    expect(baseElement).toBeTruthy();
  });
});
