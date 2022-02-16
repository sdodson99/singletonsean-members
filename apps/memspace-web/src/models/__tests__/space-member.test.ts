import { SpaceMember } from '../space-member';
import paper from 'paper';

describe('SpaceMember', () => {
  let member: SpaceMember;

  beforeEach(() => {
    member = new SpaceMember('1', 'username', 'photoUrl', 'message');
  });

  describe('get speedPixelsPerSecond', () => {
    beforeEach(() => {
      member.speedPixelsPerSecond = 50;
    });

    it('should return desired speed when not paused', () => {
      member.unpause();

      expect(member.speedPixelsPerSecond).toBe(50);
    });

    it('should return 0 speed when paused', () => {
      member.pause();

      expect(member.speedPixelsPerSecond).toBe(0);
    });
  });

  describe('set direction', () => {
    it('should normalize radians when negative angle provided', () => {
      member.directionRadians = -(7 * Math.PI) / 3; // -420 degree angle

      expect(member.directionRadians).toBeCloseTo((5 * Math.PI) / 3); // 300 degree angle
    });

    it('should normalize radians when excessive angle provided', () => {
      member.directionRadians = (13 * Math.PI) / 6; // 750 degree angle

      expect(member.directionRadians).toBeCloseTo(Math.PI / 6); // 30 degree angle
    });
  });

  describe('load', () => {
    it('should initialize height and width', () => {
      member.load();

      expect(member.loaded).toBeTruthy();
      expect(member.height).toBe(50);
      expect(member.width).toBe(50);
    });
  });

  describe('initialize position', () => {
    it('should initialize position', () => {
      member.initializePosition(1, 1);

      expect(member.x).toBe(1);
      expect(member.y).toBe(1);
      expect(member.positionInitialized).toBeTruthy();
    });

    it('should only allow position to be initialized once', () => {
      member.initializePosition(1, 1);
      member.initializePosition(2, 2);

      expect(member.x).toBe(1);
      expect(member.y).toBe(1);
      expect(member.positionInitialized).toBeTruthy();
    });
  });

  describe('update', () => {
    let bounds: paper.Rectangle;

    beforeEach(() => {
      bounds = {
        top: 0,
        left: 0,
        bottom: 100,
        right: 100,
      } as paper.Rectangle;

      member.initializePosition(50, 50);
      member.height = 4;
      member.width = 4;
    });

    it('should move member', () => {
      member.speedPixelsPerSecond = 5;

      member.update(1, bounds);

      expect(member.x).toBe(55);
      expect(member.y).toBe(50);
    });

    it('should bounce raster off left wall on collision', () => {
      member.speedPixelsPerSecond = 80;
      member.directionRadians = (5 * Math.PI) / 6; // 150 degree angle

      member.update(1, bounds);

      expect(member.x).toBe(2); // Left wall and half width of raster
      expect(member.directionRadians).toBeCloseTo(Math.PI / 6); // 30 degree angle
    });

    it('should bounce raster off right wall on collision', () => {
      member.speedPixelsPerSecond = 80;
      member.directionRadians = Math.PI / 6; // 30 degree angle

      member.update(1, bounds);

      expect(member.x).toBe(98); // Right wall and half width of raster
      expect(member.directionRadians).toBeCloseTo((5 * Math.PI) / 6); // 150 degree angle
    });

    it('should bounce raster off top wall on collision', () => {
      member.speedPixelsPerSecond = 80;
      member.directionRadians = Math.PI / 3; // 60 degree angle

      member.update(1, bounds);

      expect(member.y).toBe(98); // Top wall and half height of raster
      expect(member.directionRadians).toBeCloseTo((5 * Math.PI) / 3); // 300 degree angle
    });

    it('should bounce raster off bottom wall on collision', () => {
      member.speedPixelsPerSecond = 80;
      member.directionRadians = (4 * Math.PI) / 3; // 240 degree angle

      member.update(1, bounds);

      expect(member.y).toBe(2); // Bottom wall and half height of raster
      expect(member.directionRadians).toBeCloseTo((2 * Math.PI) / 3); // 120 degree angle
    });
  });

  describe('clone', () => {
    it('should return new space member instance for member', () => {
      const clonedMember = member.clone();

      expect(clonedMember).not.toBe(member);
      expect(clonedMember.id).toBe(member.id);
    });
  });
});