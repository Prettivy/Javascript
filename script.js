window.onload = function()
{
  var canvas;
  var canW = 900;
  var canH = 600
  var blo = 30;
  var ctx;
  var delay = 100;
  var snakee;
  var applee;
  var widthBlo = canW/blo;
  var heightBlo = canH/blo;
  var score;
  var timeout;
  init();

  function init()
  {
    canvas = document.createElement('canvas');
    canvas.width = canW;
    canvas.height = canH;
    canvas.style.border = "30px solid gray";
    canvas.style.margin ="10px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor ="#ddd";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    snakee = new snack ([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
    applee = new apple([10,10]);
    score = 0;
    refreshCanvas();

  }
  function refreshCanvas()
  {
    snakee.advance();
    if(snakee.checkCollision()){
      gameOver();
    }
    else {
      if (snakee.isEatApple(applee))
        {
          score++;
          snakee.ateApple = true;
          do{

            applee.setNewPos();
          }
          while(applee.isOnSnack(snakee));
        }
      ctx.clearRect(0,0,canvas.width,canvas.height);
      drawScore();
      snakee.draw();
      applee.draw();

      timeout = setTimeout(refreshCanvas,delay);
    }


  }
  function drawBlock(ctx, position)
  {
      var x = position[0] * blo;
      var y = position[1] * blo;
      ctx.fillRect(x,y,blo,blo);
  }
  function snack(body,direction){
      this.ateApple = false;
      this.body = body;
      this.direction = direction;
      this.draw = function()
      {
        ctx.save();
        ctx.fillStyle = "#ff0000";
        for(var i=0; i< this.body.length; i++)
        {
          drawBlock(ctx, this.body[i]);
        }
        ctx.restore();
      };
      this.advance = function()
      {
        var newPos = this.body[0].slice();
        switch (this.direction)
        {
          case "left":
            newPos[0] -=1;
            break;
          case "right":
            newPos[0] +=1;
            break;
          case "down":
            newPos[1] +=1;
            break;
          case "up":
            newPos[1] -=1;
            break;
          default:
            throw("Invalid direction");
        }
        this.body.unshift(newPos);
        if(!this.ateApple)
          this.body.pop();
        else {
          this.ateApple = false;
        }
      };
      this.newDirection = function(newDir)
      {
        var allowDir;
        switch (this.direction) {
          case "left":
          case "right":
            allowDir = ["up","down"];
            break;
          case "down":
          case "up":
            allowDir =["right", "left"];
            break;
          default:
            throw("Invalid direction");
        }
        if (allowDir.indexOf(newDir)>-1)
        {
          this.direction = newDir;
        }
      }
      this.checkCollision = function()
      {
        var wallCol = false;
        var snakeCol = false;
        var head = this.body[0];
        var rest = this.body.slice(1);
        var snakeX = head[0];
        var snakeY = head[1];
        var minX = 0;
        var minY = 0;
        var maxX = widthBlo - 1;
        var maxY = heightBlo - 1;
        var isNotBHWall = snakeX < minX || snakeX > maxX;
        var isNotBVWall = snakeY < minY || snakeY > maxY;

        if (isNotBHWall || isNotBVWall)
        {
          wallCol = true;
        }
        for(var i=0; i < rest.length; i++)
        {
          if(snakeX === rest[i][0] && snakeY === rest[i][1] )
          {
            snakeCol = true;
          };
        }
        return wallCol || snakeCol;
      };
      this.isEatApple = function(appleToEat)
      {
        var head = this.body[0];
        if (head[0] === appleToEat.position[0] && head[1]=== appleToEat.position[1])
          return true;
        else
        return false;
      };
  }
  function apple(position)
  {
    this.position = position;
    this.draw = function()
    {
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      var radius = blo/2;
      var x = this.position[0]*blo + radius;
      var y = this.position[1]*blo + radius;
      ctx.arc(x,y,radius,0,Math.PI*2,true);
      ctx.fill();
      ctx.restore();
    };
    this.setNewPos = function()
    {
      var newX = Math.round(Math.random() * (widthBlo - 1));
      var newY = Math.round(Math.random() * (heightBlo - 1));
      this.position = [newX,newY];
    };
    this.isOnSnack = function(snakeToCheck)
    {
      var isOnSnack = false;
      for (var i=0; i<snakeToCheck.body.length; i++)
        {
          if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
          {
              isOnSnack = true;
          }
        }
      return isOnSnack;
    };
  }
  function gameOver(){
    ctx.save();
    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.StrokeStyle = "white";
    ctx.lineWidth = 2;
    var centreX = canW /2;
    var centreY = canH / 2;
    ctx.strokeText("Game Over",centreX,centreY - 180);
    ctx.font = "bold 30px sans-serif";
    ctx.fillText("Appuyer sur la touche espace pour rejouer",centreX,centreY - 120);

    ctx.restore();
  };
  function restart()
  {
    snakee = new snack ([[6,4],[5,4],[4,4],[3,4],[2,4]], "right");
    applee = new apple([10,10]);
    score = 0;
    clearTimeout(timeout);
    refreshCanvas();
  };
  function drawScore()
  {
    ctx.save();
    ctx.font = "bold 200px sans-serif";
    ctx.fillStyle = "gray";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var centreX = canW /2;
    var centreY = canH / 2;
    ctx.fillText(score.toString(),centreX,centreY);
    ctx.restore();
  }

  document.onkeydown = function handleKeyDown(e)
  {
    var key = e.keyCode;
    var newDir;
    switch (key) {
      case 37:
          newDir = "left";
        break;
      case 38:
        newDir = "up";
        break;
      case 39:
        newDir = "right"
        break;
      case 40:
        newDir = "down";
        break;
      case 32:
        restart();
        return;
      default:
        return;
    }
    snakee.newDirection(newDir);
  }

}
