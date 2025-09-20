import { Vector2, Vector3 } from "@minecraft/server";
import { degToRad } from "./calc";

export default class CustomVector3 implements Vector3 {
  constructor(public x: number, public y: number, public z: number) {}

  public static createSphere(
    center: CustomVector3,
    radius: number,
    amount: number,
    surface: boolean = false
  ): CustomVector3[] {
    let positions: CustomVector3[] = [];
    for (let i = 0; i < amount; i++) {
      // Random angles for spherical coordinates
      const theta = Math.random() * 2 * Math.PI; // Random angle in [0, 2PI]
      const phi = Math.acos(2 * Math.random() - 1); // Random angle in [0, PI]

      let r = radius;
      if (surface) {
        r *= Math.cbrt(Math.random()); // Random distance from the center to the surface
      } else {
        r *= Math.random(); // Random distance from the center to anywhere inside the sphere
      }

      // Convert spherical to Cartesian coordinates
      const x = center.x + r * Math.sin(phi) * Math.cos(theta);
      const y = center.y + r * Math.sin(phi) * Math.sin(theta);
      const z = center.z + r * Math.cos(phi);

      // Create a new vector for the position
      positions.push(new CustomVector3(x, y, z));
    }
    return positions;
  }
  public static createCylinder(
    center: CustomVector3,
    radius: number,
    height: number,
    amount: number,
    surface: boolean = false
  ): CustomVector3[] {
    let positions: CustomVector3[] = [];
    for (let i = 0; i < amount; i++) {
      // Random angle for cylindrical coordinates
      const theta = Math.random() * 2 * Math.PI; // Random angle in [0, 2PI]
      // Random height along the cylinder's vertical axis (y-axis)
      const y = center.y - height / 2 + Math.random() * height; // Random height in [center.y - height/2, center.y + height/2]
      // Determine the radius for this point
      const pointRadius = surface ? radius : Math.random() * radius;
      // Circle in the horizontal plane (x, z axes) with variable radius for volume distribution
      const x = center.x + pointRadius * Math.cos(theta); // Circular path around x-axis
      const z = center.z + pointRadius * Math.sin(theta); // Circular path around z-axis, perpendicular to the x-axis

      // Create a new vector for the position
      positions.push(new CustomVector3(x, y, z));
    }
    return positions;
  }
  public static fromMC(vec3: Vector3) {
    return new CustomVector3(vec3.x, vec3.y, vec3.z);
  }
  static randomWithinRadius(center: Vector3, radius: number): Vector3 {
    const randomAngle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radius;
    const x = center.x + Math.cos(randomAngle) * distance;
    const z = center.z + Math.sin(randomAngle) * distance;

    return new CustomVector3(x, center.y, z); // Keep the Y-value at player's height initially
  }
  public distanceTo(other: CustomVector3): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  public add(other: Vector3): CustomVector3 {
    return new CustomVector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  public subtract(other: Vector3): CustomVector3 {
    return new CustomVector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  public multiply(value: number): CustomVector3 {
    return new CustomVector3(this.x * value, this.y * value, this.z * value);
  }
  public length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }
  public normalize(): CustomVector3 {
    const length = this.length();
    return new CustomVector3(this.x / length, this.y / length, this.z / length);
  }
  public dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
  public yOffset(offset: number): CustomVector3 {
    return new CustomVector3(this.x, this.y + offset, this.z);
  }
  public cross(other: Vector3): CustomVector3 {
    return new CustomVector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }
  public angleDegrees(other: CustomVector3): number {
    // cos(theta) = (A . B) / (|A| * |B|)
    const dot = this.dot(other);
    const lengthA = this.length();
    const lengthB = other.length();
    const cosTheta = dot / (lengthA * lengthB);
    const angle = Math.acos(cosTheta) * (180 / Math.PI);

    const cross = this.cross(other);
    if (cross.y < 0) return -angle;
    return angle;
  }
  public rotateX(degrees: number): CustomVector3 {
    const angle: number = degToRad(degrees);
    return new CustomVector3(
      this.x * Math.cos(angle),
      this.y - Math.sin(angle),
      this.z * Math.cos(angle)
    );
  }
  public rotateY(degrees: number): CustomVector3 {
    const angle: number = degToRad(degrees);
    return new CustomVector3(
      this.x * Math.cos(angle) - this.z * Math.sin(angle),
      this.y,
      this.x * Math.sin(angle) + this.z * Math.cos(angle)
    );
  }
  public rotate(degrees: Vector2): CustomVector3 {
    return this.rotateX(degrees.x).rotateY(degrees.y);
  }
  public roundAll(): CustomVector3 {
    return new CustomVector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
  }

  public floorAll(): CustomVector3 {
    return new CustomVector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
  }
  public abs(): CustomVector3 {
    return new CustomVector3(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
  }

  public equals(other: Vector3) {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  public toString(): string {
    return `Vec3(${this.x}, ${this.y}, ${this.z})`;
  }

  public scale(factor: number): CustomVector3 {
    return new CustomVector3(this.x * factor, this.y * factor, this.z * factor);
  }

  public static distance(a: Vector3, b: Vector3): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
  }
}
