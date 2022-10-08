export function getValue(value: [number, number], valueType: string): number;
export function getValue(value: undefined, valueType: string): undefined;
export function getValue(value: [number, number] | undefined, valueType: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  switch (valueType) {
    case '1': {
      return value[0];
    }
    case '2': {
      return value[1];
    }
    case '3': {
      return Math.max(value[1] - value[0], 0);
    }
    case '4': {
      return value[0] - value[1];
    }
  }
  return 0;
}
