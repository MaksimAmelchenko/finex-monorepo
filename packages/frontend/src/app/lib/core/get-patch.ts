export function isObject(value: any) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function arrayEquals(a: [string | number][], b: [string | number][]): boolean {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((value, index) => value === b[index]);
}

export function getPatch(
  obj1: Record<string, any>,
  obj2: Record<string, any>,
  excludedKeys: string[] = []
): Record<string, any> {
  return Object.keys(obj2)
    .filter(key => !excludedKeys.includes(key))
    .reduce<Record<string, any>>((acc, key) => {
      if (Array.isArray(obj2[key])) {
        if (!arrayEquals(obj1[key], obj2[key])) {
          acc[key] = obj2[key];
        }
        return acc;
      }
      if (!isObject(obj2[key])) {
        if (obj1[key] !== obj2[key]) {
          acc[key] = obj2[key];
        }
        return acc;
      }
      return acc;
    }, {});
}
