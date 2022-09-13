export function getRandomValue(min, max) {
  return Math.floor(min + (Math.random() * (max - min)));
}

export class TouchController {
  static Mount(holder, object) {
    this.sensitivity = 0.1;
    this.touchStart = null;
    this.touchPosition = null;
    holder.addEventListener("touchstart", (e) => { this.TouchStart(e); }); //Начало касания
    holder.addEventListener("touchmove", (e) => { this.TouchMove(e); }); //Движение пальцем по экрану
    //Пользователь отпустил экран
    holder.addEventListener("touchend", (e) => { this.TouchEnd(e, object); });
    //Отмена касания
    holder.addEventListener("touchcancel", (e) => { this.TouchEnd(e, object); });
    console.log('Touch controller was mounted!');
  }

  static TouchStart(e)
  {
      console.log('Touch!');
      //Получаем текущую позицию касания
      this.touchStart = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      this.touchPosition = { x: this.touchStart.x, y: this.touchStart.y };
  }

  static TouchMove(e)
  {
    this.touchPosition = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }

  static TouchEnd(e, object)
  {
      this.CheckAction(object); //Определяем, какой жест совершил пользователь
      this.touchStart = null;
      this.touchPosition = null;
  }

  static CheckAction(object)
  {
    console.log('Check action');
    var d = //Получаем расстояния от начальной до конечной точек по обеим осям
    {
      x: this.touchStart.x - this.touchPosition.x,
      y: this.touchStart.y - this.touchPosition.y
    };
    
    if(Math.abs(d.x) > Math.abs(d.y)) //Проверяем, движение по какой оси было длиннее
    {
      if(Math.abs(d.x) > this.sensitivity) //Проверяем, было ли движение достаточно длинным
      {
        if(d.x > 0) //Если значение больше нуля, значит пользователь двигал пальцем справа налево
        {
          object.dx = -1;
          object.dy = 0;
        }
        else //Иначе он двигал им слева направо
        {
          object.dx = 1;
          object.dy = 0;
        }
      }
    }
    else //Аналогичные проверки для вертикальной оси
    {
      if(Math.abs(d.y) > this.sensitivity)
      {
        if(d.y > 0) //Свайп вверх
        {
          object.dx = 0;
          object.dy = -1;
        }
        else //Свайп вниз
        {
          object.dx = 0;
          object.dy = 1;
        }
      }
    }
  }
}