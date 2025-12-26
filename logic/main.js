var gameCanvas = document.getElementById('pongCanvas');
var ctx = gameCanvas.getContext('2d');
//ball settings
var ballX = 425;
var ballY = 300;
var ballspeedX = 2;
var ballspeedY = 2;
var radius = 7.5; //half of 15, since 15 is the diameter of the cube
//player 1 controls
var player1Y = 250;
var player1UP = false;
var player1DOWN = false;
var wKeyIsPressed = false;
var sKeyIsPressed = false;
var P1slowDown = false;
//player 2 controls
var player2Y = 250;
var player2UP = false;
var player2DOWN = false;
var upArrowIsPressed = false;
var downArrowIsPressed = false;
//computer AI variables
var computerSpeed = 3.5; // 0 = Off, 2 = Easy, 3 = Normal, 3.5 = Hard
//right paddle "AI"
function UpdateAI() {
    if (ballX <= 375) {
        return;
    }
    var paddleCenter = player2Y + 50;
    var deadzone = 10;
    if (ballY >= paddleCenter + deadzone) { //Move down
        player2Y = player2Y + computerSpeed;
    }
    if (ballY <= paddleCenter - deadzone) { //move up
        player2Y = player2Y - computerSpeed;
    }
    if (player2Y <= 0) {
        player2Y = 0;
    }
    if (player2Y >= 500) {
        player2Y = 500;
    }
}
;
//function that ensures the animation
function gameLoop() {
    ctx.fillStyle = '#ffffff';
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ballX = ballX + ballspeedX;
    ballY = ballY + ballspeedY;
    //make the ball bounce around on impact
    if (ballY - radius < 0) {
        ballY = radius;
        ballspeedY = Math.abs(ballspeedY);
    }
    if (ballY + radius > gameCanvas.height) {
        ballY = gameCanvas.height - radius;
        ballspeedY = -Math.abs(ballspeedY);
    }
    if (ballX - radius < 0 || ballX + radius > gameCanvas.width) {
        ballspeedX = ballspeedX * -1;
    }
    //collisions
    // 1. LEFT PADDLE (Player 1)
    if (ballX - radius <= 60 && ballX - radius >= 50) {
        if (ballY >= player1Y && ballY <= player1Y + 100) {
            // Force ball to move RIGHT
            ballspeedX = Math.abs(ballspeedX);
            // PHYSICS: Calculate angle based on where it hit
            var deltaY = ballY - (player1Y + 50); // How far from center?
            ballspeedY = deltaY * 0.1; // Convert distance to speed (0.1 is the "sensitivity")
        }
    }
    // 2. RIGHT PADDLE (Player 2 / AI)
    if (ballX + radius >= 790 && ballX + radius <= 800) {
        if (ballY >= player2Y && ballY <= player2Y + 100) {
            // Force ball to move LEFT
            ballspeedX = -Math.abs(ballspeedX);
            // PHYSICS: Calculate angle based on where it hit
            var deltaY = ballY - (player2Y + 50);
            ballspeedY = deltaY * 0.1;
        }
    }
    //Player 1 physics and limitations
    var currentSpeed = P1slowDown ? 2 : 3;
    if (wKeyIsPressed && player1Y > 0) {
        player1Y = player1Y - currentSpeed;
    }
    if (sKeyIsPressed && player1Y >= 0) {
        player1Y = player1Y + currentSpeed;
    }
    //setting the boundaries for Player 1
    if (player1Y < 0) {
        player1Y = 0;
    }
    if (player1Y > 500) {
        player1Y = 500;
    }
    //run "UpdateAI" function
    UpdateAI();
    //the drawing logic (animation)
    ctx.fillRect(ballX - 7.5, ballY - 7.5, 15, 15); //draw the ball center with "x" as its radius
    ctx.fillRect(50, player1Y, 10, 100); //left paddle
    ctx.fillRect(790, player2Y, 10, 100); //right paddle
    requestAnimationFrame(gameLoop); //end of loop
}
gameLoop();
//definition of the controls
document.addEventListener('keydown', function (event) {
    if (event.key === 'w' || event.key === 'W') {
        wKeyIsPressed = true;
    }
    if (event.key === 's' || event.key === 'S') {
        sKeyIsPressed = true;
    }
    if (event.key === 'Shift') {
        P1slowDown = true;
    }
});
document.addEventListener('keyup', function (event) {
    if (event.key === 'w' || event.key === 'W') {
        wKeyIsPressed = false;
    }
    if (event.key === 's' || event.key === 'S') {
        sKeyIsPressed = false;
    }
    if (event.key === 'Shift') {
        P1slowDown = false;
    }
});
