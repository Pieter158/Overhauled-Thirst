import { Vector2 } from "@minecraft/server";
import { degToRad, radToDeg } from "./calc";

export default class CustomVector2 implements Vector2 {
  constructor(public x: number, public y: number) {}

  public static fromMC(vec2: Vector2) {
    return new CustomVector2(vec2.x, vec2.y);
  }

  public add(other: Vector2): CustomVector2 {
    return new CustomVector2(this.x + other.x, this.y + other.y);
  }

  public subtract(other: Vector2): CustomVector2 {
    return new CustomVector2(this.x - other.x, this.y - other.y);
  }

  public multiply(value: number): CustomVector2 {
    return new CustomVector2(this.x * value, this.y * value);
  }

  public length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  public rotate(degrees: number): CustomVector2 {
    const angle: number = degToRad(degrees);
    return new CustomVector2(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    );
  }

  public angle(): number {
    return radToDeg(
      Math.acos(this.x / Math.sqrt(this.x * this.x + this.y * this.y)) * (this.y / Math.abs(this.y))
    );
  }

  public roundAll(): CustomVector2 {
    return new CustomVector2(Math.round(this.x), Math.round(this.y));
  }

  public floorAll(): CustomVector2 {
    return new CustomVector2(Math.floor(this.x), Math.floor(this.y));
  }

  public ceilAll(): CustomVector2 {
    return new CustomVector2(Math.ceil(this.x), Math.ceil(this.y));
  }

  public abs(): CustomVector2 {
    return new CustomVector2(Math.abs(this.x), Math.abs(this.y));
  }

  public equals(other: Vector2) {
    return this.x === other.x && this.y === other.y;
  }

  public toString(): string {
    return `Vec2(${this.x}, ${this.y})`;
  }
}
