// ./node_modules/.bin/mocha --require ts-node/register --exit ./libs/get-ranges.spec.ts
import { expect } from 'chai';

import { getRanges } from './get-ranges';

describe('Get ranges', () => {
  it('should return small range from first range', () => {
    const result = getRanges(1, 1, [15, 2, 1001, 0]);

    expect(result).to.be.deep.equals([
      { offset: 1, limit: 1 },
      { offset: 0, limit: 0 },
      { offset: 0, limit: 0 },
      { offset: 0, limit: 0 },
    ]);
  });

  it('should return ranges from first range', () => {
    const result = getRanges(10, 1000, [15, 2, 1001, 0]);

    expect(result).to.be.deep.equals([
      { offset: 10, limit: 15 },
      { offset: 0, limit: 2 },
      { offset: 0, limit: 983 },
      { offset: 0, limit: 0 },
    ]);
  });

  it('should work with offset from middle ranges', () => {
    const result = getRanges(20, 10, [15, 2, 1001, 0]);

    expect(result).to.be.deep.equals([
      { offset: 0, limit: 0 },
      { offset: 0, limit: 0 },
      { offset: 3, limit: 10 },
      { offset: 0, limit: 0 },
    ]);
  });

  it('should return empty ranges for big offset', () => {
    const result = getRanges(2000, 10, [15, 2, 1001, 0]);

    expect(result).to.be.deep.equals([
      { offset: 0, limit: 0 },
      { offset: 0, limit: 0 },
      { offset: 0, limit: 0 },
      { offset: 0, limit: 0 },
    ]);
  });

  it('should return small ranges from last range', () => {
    const result = getRanges(1018, 1, [15, 2, 1001, 0]);

    expect(result).to.be.deep.equals([
      { offset: 0, limit: 0 },
      { offset: 0, limit: 0 },
      { offset: 1001, limit: 1 },
      { offset: 0, limit: 0 },
    ]);
  });

  it('should return all ranges', () => {
    const result = getRanges(0, 5000, [15, 2, 1001, 0]);

    expect(result).to.be.deep.equals([
      { offset: 0, limit: 15 },
      { offset: 0, limit: 2 },
      { offset: 0, limit: 1001 },
      { offset: 0, limit: 0 },
    ]);
  });
});
