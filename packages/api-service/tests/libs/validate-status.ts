import * as supertest from 'supertest';

export function validateStatus(response: supertest.Response, status: number): void {
  if (response.status !== status) {
    console.log('response', JSON.stringify(response.body, null, 2));
    throw new Error(`expected ${response.status} to be ${status}`);
  }
}
