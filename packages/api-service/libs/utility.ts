import * as crypto from 'crypto';

export function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

export function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export function createHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function makeMap<T>(items: T[], key: string): { [key: string]: T } {
  return items.reduce((map: { [key: string]: T }, item: T) => {
    map[item[key]] = item;
    return map;
  }, {});
}

export function paginationWrapper<T>(compareFunction: (a: T, b: T) => number) {
  return (items: T[], limit: number, offset: number): T[] => {
    return items.sort(compareFunction).slice(offset, offset + limit);
  };
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
