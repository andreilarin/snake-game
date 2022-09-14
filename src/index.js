import { Apple } from './apple';
import { GRID_HEIGHT } from './constants';
import { CELL_SIZE } from './constants';
import { GRID_WIDTH } from './constants';
import './index.css';
import { Snake } from './snake';
import { TouchController } from './utils';

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


var bw = GRID_WIDTH * CELL_SIZE;
// Box height
var bh = GRID_HEIGHT * CELL_SIZE;
// Padding
var p = 0;

function drawBoard(ctx){
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

class Game {
  constructor(canvas) {
    console.log('Init game...');
    this.canvas = canvas;
    this.snake = new Snake();
    this.apple = new Apple();
    this.ctx = canvas.getContext("2d"); //Получение контекста — через него можно работать с холстом
    this.initKeyboardListener();
    TouchController.Mount(document.body, this.snake);
    console.log('Game is initilized!');
  }

  initKeyboardListener() {
    const snake = this.snake;
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
  }

  Start()
  { 
    console.log('Start game!');
    youLoserMessage.className = 'hidden';
    this.timer = setInterval(() => this.Update(), 1000 / 10);
    console.log(this.timer);
  }
   
  Stop()
  {
    const points = this.snake.points;
    if (record && Number(record) < points || !record)
      localStorage.setItem('record', points);
    clearInterval(this.timer); //Остановка обновления
    youLoserMessage.className = '';
    drawBoard(this.ctx);
  }
   
  Update() //Обновление игры
  {
    this.Draw();
  }
   
  Draw() //Работа с графикой
  {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистка холста от предыдущего кадраp
    if (this.snake.hx === this.apple.x && this.snake.hy === this.apple.y) {
      this.snake.eat();
      this.apple.updatePosition();
    }
  
    if (this.snake.isCrashed()) {
      return this.Stop(this.snake.points);
    }

    counter.innerText = `Score: ${this.snake.points} ${record ? `Max: ${record}` : ''}`;
    this.apple.draw(this.ctx);
    this.snake.draw(this.ctx);
    drawBoard(this.ctx);
  }

  Restart() {
    window.location.reload();
  }
}

const game = new Game(canvas);

document.getElementById('restart').onclick = game.Restart;

game.Start();
console.log(game);
