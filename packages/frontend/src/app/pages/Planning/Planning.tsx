import React from 'react';
import { observer } from 'mobx-react-lite';

import { PlanTransactions } from './PlanTransactions/PlanTransactions';

export const Planning = observer(() => {
  return <PlanTransactions />;
});

export default Planning;
