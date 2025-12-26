var gameCanvas = document.getElementById('pongCanvas');
var ctx = gameCanvas.getContext('2d');
var ballX = 425;
var ballY = 300;
var ballspeedX = 2;
var ballspeedY = 2;
var radius = 7.5; //half of 15, since 15 is the diameter of the cube
var player1Y = 250;
var player2Y = 250;
var player1UP = false;
var player1DOWN = false;
var wKeyIsPressed = false;
var sKeyIsPressed = false;
//we create a function that makes a constant loop of updates
function gameLoop() {
    ctx.fillStyle = '#ffffff';
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ballX = ballX + ballspeedX;
    ballY = ballY + ballspeedY;
    if (ballY - radius < 0 || ballY + radius > gameCanvas.height) {
        ballspeedY = ballspeedY * -1;
    }
    if (ballX - radius < 0 || ballX + radius > gameCanvas.width) {
        ballspeedX = ballspeedX * -1;
    }
    if (wKeyIsPressed && player1Y >= 0) {
        player1Y = player1Y - 5;
    }
    if (sKeyIsPressed && player1Y >= 0) {
        player1Y = player1Y + 5;
    }
    if (sKeyIsPressed && player1Y >= 500) {
        player1Y = 500;
    }
    ctx.fillRect(ballX - 7.5, ballY - 7.5, 15, 15); //ballX and ballY are the CENTER of the ball, which has the radius of 15x15px
    ctx.fillRect(50, player1Y, 10, 100);
    ctx.fillRect(790, player2Y, 10, 100);
    requestAnimationFrame(gameLoop);
}
gameLoop();
document.addEventListener('keydown', function (event) {
    if (event.key === 'w' || event.key === 'W') {
        wKeyIsPressed = true;
    }
    if (event.key === 's' || event.key === 'S') {
        sKeyIsPressed = true;
    }
});
document.addEventListener('keyup', function (event) {
    if (event.key === 'w' || event.key === 'W') {
        wKeyIsPressed = false;
    }
    if (event.key === 's' || event.key === 'S') {
        sKeyIsPressed = false;
    }
});
