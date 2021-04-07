import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}
