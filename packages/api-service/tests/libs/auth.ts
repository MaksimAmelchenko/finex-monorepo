export const auth: (token: string) => { Authorization: string } = token => ({ Authorization: token });
