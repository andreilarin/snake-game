import { Cell } from './cell';
import { GRID_HEIGHT } from './constants';
import { GRID_WIDTH } from './constants';
import { getRandomValue } from './utils';

export class Snake {
  constructor() {
    this.dx = getRandomValue(-1,1) || 1;
    this.dy = getRandomValue(-1,1) && 0;
    this.hx = getRandomValue(10, 20);
    this.hy = getRandomValue(10, 20);
    this.points = 0;
    this.cells = [
    new Cell(this.hx, this.hy),
    new Cell(this.hx - this.dx, this.hy - this.dy),
    new Cell(this.hx - 2 * this.dx, this.hy - 2 * this.dy),
    ];

    this.cells;
  }

  addCell() {
    const prevLastCell = this.cells[this.cells.length - 2];
    const lastCell = this.cells.last();
    this.cells.push(new Cell(2 * lastCell.x - prevLastCell.x, 2 * lastCell.y - prevLastCell.y))
  }

  draw(ctx) {
    let lastCell = null;

    this.cells.forEach(cell => {
      if (lastCell) {
        const temp = Object.assign(new Cell(), cell)
        cell.x = lastCell.x;
        cell.y = lastCell.y;
        lastCell = temp;
      } else {
        lastCell = Object.assign(new Cell(), cell);
        const x = (cell.x + this.dx + GRID_WIDTH) % GRID_WIDTH;
        const y = (cell.y + this.dy + GRID_HEIGHT) % GRID_HEIGHT;
        this.hx = x;
        this.hy = y;
        cell.x = x;
        cell.y = y;
      }
      cell.draw(ctx);
    });
  }

  eat() {
    console.log('eat apple')
    this.addCell();
    this.points++;
  }

  isCrashed() {
    for (let i = 4; i < this.cells.length; i++) {
      if (this.cells[i].x === this.hx && this.cells[i].y === this.hy) {
        return true;
      }
    }
    // if (this.hx === GRID_WIDTH || this.hx === 0 || this.hy === GRID_HEIGHT || this.hy === 0)
    //   return true;
    return false;
  }
}
  