import { render } from '@testing-library/react';

import { TreeTableRow } from './tree-table';

describe('TreeTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TreeTableRow isVisible={true} />);
    expect(baseElement).toBeTruthy();
  });
});
