import { GRID_WIDTH } from './constants';
import { GRID_HEIGHT } from './constants';
import { CELL_SIZE } from './constants';
import { getRandomValue } from './utils';

export class Apple {
  constructor() {
    this.updatePosition();
  }

  draw(ctx) {
    ctx.fillStyle="green";
    ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  updatePosition() {
    this.x = getRandomValue(2, GRID_WIDTH - 2);
    this.y = getRandomValue(2, GRID_HEIGHT - 2);
  }
}