import { render } from '@testing-library/react';

import { IconButton } from './icon-button';
import { LeftRightIcon } from '@finex/ui-kit';

describe('IconButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <IconButton>
        <LeftRightIcon />
      </IconButton>
    );
    expect(baseElement).toBeTruthy();
  });
});
