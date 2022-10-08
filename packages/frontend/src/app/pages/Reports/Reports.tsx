import React from 'react';
import { observer } from 'mobx-react-lite';

import { DynamicsReport } from './DynamicsReport/DynamicsReport';

export const Reports = observer(() => {
  return (
    <>
      <DynamicsReport />
    </>
  );
});

export default Reports;
