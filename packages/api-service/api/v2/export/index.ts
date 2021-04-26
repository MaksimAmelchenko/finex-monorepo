import { getRestApi } from '../../../libs/rest-api';

import { exportToCsv } from './export-to-csv';

export const exportApi = getRestApi([
  //
  exportToCsv,
]);
