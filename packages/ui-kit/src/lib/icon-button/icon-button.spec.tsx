import { render } from '@testing-library/react';

import { IconButton } from './icon-button';
import { FilterFunnel01Icon } from '@finex/ui-kit';

describe('IconButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <IconButton>
        <FilterFunnel01Icon />
      </IconButton>
    );
    expect(baseElement).toBeTruthy();
  });
});
