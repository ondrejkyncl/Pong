
Object.defineProperty(exports, "__esModule", { value: true });
var gameCanvas = document.getElementById('pongCanvas');
var ctx = gameCanvas.getContext('2d');
var ballX = 425;
var ballY = 300;
var ballspeedX = 2;
var ballspeedY = 2;
//we create a function that makes a constant loop of updates
function gameLoop() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ballX = ballX + ballspeedX;
    ballY = ballY + ballspeedY;
    ctx.fillRect(ballX, ballY, 15, 15);
    ctx.fillRect(50, 250, 10, 100);
    ctx.fillRect(790, 250, 10, 100);
    requestAnimationFrame(gameLoop);
}
ctx.fillStyle = '#ffffff';
