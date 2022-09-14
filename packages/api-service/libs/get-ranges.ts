interface IRange {
  offset: number;
  limit: number;
}

// lengths - array of length of items: [15, 2, 1001, 0]
// for {offset: 10, limit: 1000} result will be
// [
//     { offset: 10, limit: 15 },
//     { offset: 0, limit: 2 },
//     { offset: 0, limit: 983 },
//     { offset: 0, limit: 0 }
//   ]
// for {offset: 20, limit: 10} result will be [{0, 0}, {0, 0}, {3, 103}, {0, 0},]
export function getRanges(offset: number, limit: number, lengths: number[]): IRange[] {
  const result: IRange[] = [];
  let i = 0;
  let l = lengths[i];

  let position = offset;
  while (position > l && i < lengths.length) {
    position -= l;
    result.push({ offset: 0, limit: 0 });
    i++;
    l = lengths[i];
  }

  let length = 0;
  while (length < limit && i < lengths.length) {
    result.push({ offset: position, limit: Math.min(l, limit - length) });
    length += Math.min(l, limit - length);
    position = 0;
    i++;
    l = lengths[i];
  }

  while (i < lengths.length) {
    result.push({ offset: 0, limit: 0 });
    i++;
    l = lengths[i];
  }

  return result;
}
