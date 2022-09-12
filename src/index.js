import './index.css';

if (!Array.prototype.last){
  Array.prototype.last = function(){
      return this[this.length - 1];
  };
};

if (!Array.prototype.first){
  Array.prototype.first = function(){
      return this[0];
  };
};

if (!Array.prototype.choice){
  Array.prototype.choice = function(){
    var index = Math.floor(Math.random() * this.length);
    return this[index];
  };
};

const CELL_SIZE = 20;

const GRID_WIDTH = 30;
const GRID_HEIGHT = 30;

const canvas = document.createElement('canvas');
canvas.setAttribute('width', GRID_WIDTH * CELL_SIZE);
canvas.setAttribute('height', GRID_HEIGHT * CELL_SIZE);
document.body.appendChild(canvas);

var ctx = canvas.getContext("2d"); //Получение контекста — через него можно работать с холстом


function getRandomValue(min, max) {
  return Math.floor(min + (Math.random() * (max - min)));
}

class Snake {
  constructor() {
    this.dx = getRandomValue(-1,1) || 1;
    this.dy = getRandomValue(-1,1) && 0;
    this.hx = getRandomValue(10, 20);
    this.hy = getRandomValue(10, 20);
    this.points = 0;
    this.isCellAdded = false;
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
    console.log(prevLastCell, lastCell);
    this.cells.push(new Cell(2 * lastCell.x - prevLastCell.x, 2 * lastCell.y - prevLastCell.y))
    console.log(this.cells)
  }

  draw() {
    let lastCell = null;

    this.cells.forEach(cell => {

      if (lastCell) {
        const temp = Object.assign(new Cell(), cell)
        cell.x = lastCell.x;
        cell.y = lastCell.y;
        lastCell = temp;
      } else {
        lastCell = Object.assign(new Cell(), cell);
        this.hx = cell.x + this.dx;
        this.hy = cell.y + this.dy;
        cell.x = this.hx;
        cell.y = this.hy;
      }
      cell.draw();
    });
  }

  eat() {
    console.log('eat apple')
    this.addCell();
    this.points++;
    // const allCells = [];
    
    // for (let i = 0; i < GRID_WIDTH; i++) {
    //   for (let j = 0; j < GRID_HEIGHT; j++) {
    //     allCells.push({ x:i, y:j })
    //   }
    // }

    // const emptyCells = allCells.filter(cell => this.cells.some(snakeCell => snakeCell.isIntersected(cell)));

    // const emptyCell = emptyCells.choice();
    
    
  }

  isCrashed() {
    for (let i = 4; i < this.cells.length; i++) {
      if (this.cells[i].x === this.hx && this.cells[i].y === this.hy) {
        return true;
      }
    }
    if (this.hx === GRID_WIDTH || this.hx === 0 || this.hy === GRID_HEIGHT || this.hy === 0)
      return true;
    return false;
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.fillStyle="red";
    ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  isIntersected(cell) {
    return this.x === cell.x && this.y === cell.y;
  }
}

class Apple {
  constructor() {
    this.updatePosition();
  }

  draw() {
    ctx.fillStyle="green";
    ctx.fillRect(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  updatePosition() {
    this.x = getRandomValue(2, GRID_WIDTH - 2);
    this.y = getRandomValue(2, GRID_HEIGHT - 2);
  }
}

class Game {
  static Start()
  {
    const snake = new Snake();
    const apple = new Apple();
  
    document.addEventListener('keydown', function (e) {
      if (e.code === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -1;
        snake.dy = 0;
      }
      else if (e.code === 'ArrowUp' && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = -1;
      }
      else if (e.code === 'ArrowRight' && snake.dx === 0) {
        snake.dx = 1;
        snake.dy = 0;
      }
      else if (e.code === 'ArrowDown' && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = 1;
      }
    });
    
    this.timer = setInterval(() => this.Update(snake, apple), 1000 / 5); //Состояние игры будет обновляться 60 раз в секунду — при такой частоте обновление происходящего будет казаться очень плавным
  }
   
  static Stop()
  {
    clearInterval(this.timer); //Остановка обновления
  }
   
  static Update(snake, apple) //Обновление игры
  {
    this.Draw(snake, apple);
  }
   
  static Draw(snake, apple) //Работа с графикой
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистка холста от предыдущего кадра
    // console.log(snake.hx, apple.x);
    if (snake.hx === apple.x && snake.hy === apple.y) {
      snake.eat(apple);
      apple.updatePosition();
    }
  
    if (snake.isCrashed()) {
      return this.Stop();
    }
  
    apple.draw();
    snake.draw();
  }
}

Game.Start();