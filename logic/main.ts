export {}
const gameCanvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
const ctx = gameCanvas.getContext('2d')!
let ballX: number = 425
let ballY: number = 300
let ballspeedX: number = 2
let ballspeedY: number = 2
let radius: number = 7.5 //half of 15, since 15 is the diameter of the cube

//we create a function that makes a constant loop of updates
function gameLoop () {
    ctx.fillStyle = '#ffffff'
    ctx.clearRect(0,0, gameCanvas.width, gameCanvas.height);
    ballX = ballX + ballspeedX
    ballY = ballY + ballspeedY
        if (ballY - radius < 0 || ballY + radius > gameCanvas.height) {
            ballspeedY = ballspeedY * -1;
    }
        if (ballX - radius < 0 || ballX + radius > gameCanvas.width) {
            ballspeedX = ballspeedX * -1;
        }
    ctx.fillRect(ballX -7.5, ballY -7.5, 15, 15); //ballX and ballY are the CENTER of the ball, which has the radius of 15x15px
    ctx.fillRect(50, 250, 10, 100);
    ctx.fillRect(790, 250, 10, 100);
    requestAnimationFrame(gameLoop);
    
}
gameLoop();
