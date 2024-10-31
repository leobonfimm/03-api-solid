import {
  Coordinate,
  getDistanceBetweenCoordinates,
} from './get-distance-between-coordinates';

describe('Get Distance Between Coordinates', () => {
  it('should return 0 if the coordinates are identical', () => {
    const point: Coordinate = { latitude: 0, longitude: 0 };

    expect(getDistanceBetweenCoordinates(point, point)).toEqual(0);
  });

  it('should calculate te correct distance between two different coordinates', () => {
    const from: Coordinate = { latitude: -3.6879293, longitude: -40.3398461 };
    const to: Coordinate = { latitude: -3.7366304, longitude: -38.5200357 };
    const distance = getDistanceBetweenCoordinates(from, to);

    expect(distance).toBeCloseTo(202, 0);
  });

  it('should correctly handle edge coordinates (North Pole to South Pole)', () => {
    const from: Coordinate = { latitude: 90, longitude: 0 };
    const to: Coordinate = { latitude: -90, longitude: 0 };
    const distance = getDistanceBetweenCoordinates(from, to);

    expect(distance).toBeCloseTo(20015, 0);
  });

  it('should calculate the correct distance between two close coordinates', () => {
    const from: Coordinate = { latitude: 37.7749, longitude: -122.4194 };
    const to: Coordinate = { latitude: 37.774, longitude: -122.4313 };
    const distance = getDistanceBetweenCoordinates(from, to);

    expect(distance).toBeCloseTo(1.1, 1);
  });
});
