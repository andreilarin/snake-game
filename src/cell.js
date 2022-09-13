import { CELL_SIZE } from "./constants";

export class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    ctx.fillStyle="red";
    ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  isIntersected(cell) {
    return this.x === cell.x && this.y === cell.y;
  }
}