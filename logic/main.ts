export {};
const gameCanvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
const ctx = gameCanvas.getContext('2d')!
let ballX: number = 425
let ballY: number = 300
let ballspeedX: number = 2
let ballspeedY: number = 2

//we create a function that makes a constant loop of updates
function gameLoop () {
    ctx.clearRect(0,0, gameCanvas.width, gameCanvas.height);
    ballX = ballX + ballspeedX
    ballY = ballY + ballspeedY
    ctx.fillRect(ballX, ballY, 15, 15);
    ctx.fillRect(50, 250, 10, 100);
    ctx.fillRect(790, 250, 10, 100);
    requestAnimationFrame(gameLoop);
}
ctx.fillStyle = '#ffffff'
