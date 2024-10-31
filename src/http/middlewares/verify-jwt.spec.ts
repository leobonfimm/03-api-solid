import fastifyJwt from '@fastify/jwt';
import fastify from 'fastify';
import { verifyJWT } from './verify-jwt';

const app = fastify();

app.register(fastifyJwt, {
  secret: 'supersecret',
});

app.get('/protected', { preValidation: verifyJWT }, async () => {
  return { message: 'Success!' };
});

describe('verifyJWT middleware', () => {
  it('should return 401 if JWT is invalid', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/protected',
      headers: {
        Authorization: 'Bearer invalid_token',
      },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toEqual({ message: 'Unauthorized' });
  });

  it('should allow access if JWT is valid', async () => {
    const token = app.jwt.sign({ user: 'test' });
    const response = await app.inject({
      method: 'GET',
      url: '/protected',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Success!' });
  });
});
