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

const mainContainer = document.createElement('div');
mainContainer.setAttribute('id', 'main');

const title = document.createElement('p');
title.setAttribute('id', 'title');
title.innerText = 'SNAKE';

const record = localStorage.getItem('record');

const counter = document.createElement('p');
counter.setAttribute('id', 'counter');
counter.innerText = `Score: 0 ${record ? `Max: ${record}` : ''}`;

const footer = document.createElement('p');
footer.setAttribute('id', 'developers');
footer.innerHTML = 'by <a href="https://github.com/andreilarin">Andrew Larin</a> and <a href="https://github.com/andreilarin">Igor Alekseev</a>'
document.body.appendChild(footer);

const canvas = document.createElement('canvas');
canvas.setAttribute('width', GRID_WIDTH * CELL_SIZE + 1);
canvas.setAttribute('height', GRID_HEIGHT * CELL_SIZE + 1);

document.body.appendChild(mainContainer);

document.getElementById('main').appendChild(title);
document.getElementById('main').appendChild(canvas);
document.getElementById('main').appendChild(counter);

const youLoserMessage = document.createElement('p');
youLoserMessage.setAttribute('id', 'you-loser');
youLoserMessage.innerHTML = `<p>You lose</p><a id="restart">RESTART</a>`
document.body.appendChild(youLoserMessage);


var ctx = canvas.getContext("2d"); //Получение контекста — через него можно работать с холстом

var bw = GRID_WIDTH * CELL_SIZE;
// Box height
var bh = GRID_HEIGHT * CELL_SIZE;
// Padding
var p = 0;

function drawBoard(){
    for (var x = 0; x <= bw; x += CELL_SIZE) {
        ctx.moveTo(0.2 + x + p, p);
        ctx.lineTo(0.2 + x + p, bh + p);
    }

    for (var x = 0; x <= bh; x += CELL_SIZE) {
      ctx.moveTo(p, 0.2 + x + p);
      ctx.lineTo(bw + p, 0.2 + x + p);
    }
    ctx.strokeStyle = `#afafaf`;
    ctx.stroke();
}



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
        const x = (cell.x + this.dx + GRID_WIDTH) % GRID_WIDTH;
        const y = (cell.y + this.dy + GRID_HEIGHT) % GRID_HEIGHT;
        this.hx = x;
        this.hy = y;
        cell.x = x;
        cell.y = y;
      }
      cell.draw();
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
    youLoserMessage.className = 'hidden';

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
    

    this.timer = setInterval(() => this.Update(snake, apple), 1000 / 10);
    console.log(this.timer);
  }
   
  static Stop(points)
  {
    if (record && Number(record) < points || !record)
      localStorage.setItem('record', points);
    clearInterval(this.timer); //Остановка обновления
    youLoserMessage.className = '';
    drawBoard();
  }
   
  static Update(snake, apple) //Обновление игры
  {
    this.Draw(snake, apple);
  }
   
  static Draw(snake, apple) //Работа с графикой
  {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистка холста от предыдущего кадраp
    if (snake.hx === apple.x && snake.hy === apple.y) {
      snake.eat(apple);
      apple.updatePosition();
    }
  
    if (snake.isCrashed()) {
      return this.Stop(snake.points);
    }
    counter.innerText = `Score: ${snake.points} ${record ? `Max: ${record}` : ''}`;
    apple.draw();
    snake.draw();
    drawBoard();
  }

  static Restart() {
    window.location.reload();
  }
}

document.getElementById('restart').onclick = Game.Restart;

Game.Start();