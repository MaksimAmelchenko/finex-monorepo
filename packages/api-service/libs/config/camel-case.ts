// snake_case to camelCase converter that simply reverses
// the actions done by `snakeCase` function.
export function camelCase(str: string) {
  if (str.length === 0) {
    return str;
  }

  let out = str[0].toLowerCase();

  for (let i = 1, l = str.length; i < l; i += 1) {
    const char = str[i];
    const prevChar = str[i - 1];

    if (char !== '_') {
      if (prevChar === '_') {
        out += char.toUpperCase();
      } else {
        out += char.toLowerCase();
      }
    }
  }

  return out;
}
