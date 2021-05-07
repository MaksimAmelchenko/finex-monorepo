export function makeMap<T extends Record<string, any>>(items: T[], key: any): Record<any, T> {
  return items.reduce((map: Record<string, T>, item: T) => {
    map[item[key]] = item;
    return map;
  }, {} as Record<any, T>);
}
