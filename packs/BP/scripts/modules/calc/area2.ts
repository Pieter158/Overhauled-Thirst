import { Vector2 } from "@minecraft/server";

export interface Area2 {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default class CustomArea2 implements Area2 {
  readonly x1: number;

  readonly y1: number;

  readonly x2: number;

  readonly y2: number;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = Math.min(x1, x2);
    this.y1 = Math.min(y1, y2);
    this.x2 = Math.max(x1, x2);
    this.y2 = Math.max(y1, y2);
  }

  public static clone(area: Area2) {
    return new CustomArea2(area.x1, area.y1, area.x2, area.y2);
  }

  public static fromVectors(v1: Vector2, v2: Vector2): CustomArea2 {
    return new CustomArea2(v1.x, v1.y, v2.x, v2.y);
  }

  public surface() {
    return (this.x2 - this.x1) * (this.y2 - this.y1);
  }

  public size(): Vector2 {
    return {
      x: this.x2 - this.x1,
      y: this.y2 - this.y1,
    };
  }

  public offset(offset: Vector2) {
    return new CustomArea2(
      this.x1 + offset.x,
      this.y1 + offset.y,
      this.x2 + offset.x,
      this.y2 + offset.y
    );
  }

  public union(other: Area2): CustomArea2 {
    return new CustomArea2(
      Math.min(this.x1, other.x1),
      Math.min(this.y1, other.y1),
      Math.max(this.x2, other.x2),
      Math.max(this.y2, other.y2)
    );
  }

  public toString(): string {
    return `Area2(${this.x1}, ${this.y1}, ${this.x2}, ${this.y2})`;
  }
}
