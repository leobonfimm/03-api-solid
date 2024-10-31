import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: `Near Gym`,
      description: null,
      phone: null,
      latitude: -3.6941315,
      longitude: -40.3394844,
    });

    await gymsRepository.create({
      title: `Far Gym`,
      description: null,
      phone: null,
      latitude: -3.7238852,
      longitude: -38.550712,
    });

    const { gyms } = await sut.execute({
      userLatitude: -3.6941315,
      userLongitude: -40.3394844,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});
