import request from 'supertest';

import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { StatusCodes } from 'http-status-codes';

describe('Search Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gym', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN');

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Near Gym`,
        description: null,
        phone: null,
        latitude: -3.6941315,
        longitude: -40.3394844,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Far Gym`,
        description: null,
        phone: null,
        latitude: -3.7238852,
        longitude: -38.550712,
      });

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -3.6941315,
        longitude: -40.3394844,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ]);
  });
});
