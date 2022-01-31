import * as fs from 'fs';
import { scanFile } from './scan-file';

export function scanDir(path: string, fileExtensions: string[]) {
  const result = {};
  const items = fs.readdirSync(path);
  let scanResult = {};

  for (const index in items) {
    const item = items[index];

    if (fs.statSync(`${path}/${item}`).isDirectory()) {
      scanResult = scanDir(`${path}/${item}`, fileExtensions);
    } else {
      const fileExt = item.split('.').pop();
      if (fileExt && fileExtensions.includes(fileExt)) {
        // if (item === 'Component.tsx') {
        scanResult = scanFile(`${path}/${item}`);
        // } else {
        //   scanResult = {};
        // }
      }
    }
    Object.assign(
      result,
      Object.keys(scanResult).reduce((prev, key) => {
        if (!prev[key]) {
          prev[key] = scanResult[key];
        } else {
          Object.assign(prev[key], scanResult[key]);
        }
        return prev;
      }, result)
    );
  }

  return result;
}
