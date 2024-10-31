import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { CheckInUseCase } from './check-ins';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('CheckIns Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -3.6941315,
      longitude: -40.3394844,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.6941315,
      userLongitude: -40.3394844,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2024, 9, 25, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.6941315,
      userLongitude: -40.3394844,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -3.6941315,
        userLongitude: -40.3394844,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check in twice but in the different days', async () => {
    vi.setSystemTime(new Date(2024, 9, 25, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.6941315,
      userLongitude: -40.3394844,
    });

    vi.setSystemTime(new Date(2024, 9, 26, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -3.6941315,
      userLongitude: -40.3394844,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distance gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Top Up',
      description: '',
      phone: '',
      latitude: new Decimal(-3.6766307),
      longitude: new Decimal(-40.359117),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -3.6941315,
        userLongitude: -40.3394844,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });

  it('should not be able to check in a inexistent gym', async () => {
    await expect(() =>
      sut.execute({
        gymId: 'inexistent-id',
        userId: 'user-01',
        userLatitude: -3.6941315,
        userLongitude: -40.3394844,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
