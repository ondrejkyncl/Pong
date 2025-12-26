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
var wKeyIsPressed = false;
var sKeyIsPressed = false;
var P1slowDown = false;
//player 2 controls
var player2Y = 250;
var upArrowIsPressed = false;
var downArrowIsPressed = false;
//computer AI variables
var computerSpeed = 2; // 0 = Off, 2 = Easy, 3 = Normal, 3.5 = Hard
//acceleration/decceleration
var player1Velocity = 0;
var player2Velocity = 0;
var acceleration = 0.75;
var friction = 0.88;
var maxSpeed = 3;
//keeping score
var Player1Score = 0;
var Player2Score = 0;
var WinningScore = 10;
//right paddle "AI"
function UpdateAI() {
    if (ballX <= 375) {
        player2Velocity = player2Velocity * friction;
        player2Y = player2Y + player2Velocity;
        return;
    }
    var paddleCenter = player2Y + 50;
    var deadzone = 10;
    if (ballY >= paddleCenter + deadzone) { //move down
        player2Velocity = player2Velocity + acceleration;
    }
    else if (ballY <= paddleCenter - deadzone) { //move up
        player2Velocity = player2Velocity - acceleration;
    }
    else {
        player2Velocity = player2Velocity * 0.8;
    }
    if (player2Velocity > computerSpeed) {
        player2Velocity = computerSpeed;
    }
    if (player2Velocity < -computerSpeed) {
        player2Velocity = -computerSpeed;
    }
    player2Y = player2Y + player2Velocity;
    // AI limitations
    if (player2Y < 0) {
        player2Y = 0;
        player2Velocity = 0;
    }
    if (player2Y > 500) {
        player2Y = 500;
        player2Velocity = 0;
    }
}
//restarts the ball (:O)
function resetBall(direction) {
    ballX = 850 / 2;
    ballY = 600 / 2;
    ballspeedX = 0;
    ballspeedY = 0;
    setTimeout(function () {
        ballspeedY = Math.random() * 5;
        ballspeedX = direction;
    }, 1000);
}
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
    if (ballX >= 850) {
        Player1Score++;
        ballspeedX = 2;
        resetBall(2);
    }
    if (ballX <= 0) {
        Player2Score++;
        ballspeedX = -2;
        resetBall(-2);
    }
    //collisions
    //1. Player 1
    if (ballX - radius <= 60 && ballX - radius >= 50) {
        if (ballY >= player1Y && ballY <= player1Y + 100) {
            ballspeedX = Math.abs(ballspeedX);
            var deltaY = ballY - (player1Y + 50);
            ballspeedY = deltaY * 0.1;
        }
    }
    // 2. Player 2 / AI
    if (ballX + radius >= 790 && ballX + radius <= 800) {
        if (ballY >= player2Y && ballY <= player2Y + 100) {
            ballspeedX = -Math.abs(ballspeedX);
            var deltaY = ballY - (player2Y + 50);
            ballspeedY = deltaY * 0.1;
        }
    }
    //Player 1 physics and limitations
    var currentMaxSpeed = P1slowDown ? 3 : maxSpeed;
    var currentAccel = P1slowDown ? 0.2 : acceleration;
    //acceleration
    if (wKeyIsPressed) {
        player1Velocity = player1Velocity - currentAccel;
    }
    if (sKeyIsPressed) {
        player1Velocity = player1Velocity + currentAccel;
    }
    //friction
    player1Velocity = player1Velocity * friction;
    //speed Limit
    if (player1Velocity > currentMaxSpeed) {
        player1Velocity = currentMaxSpeed;
    }
    if (player1Velocity < -currentMaxSpeed) {
        player1Velocity = -currentMaxSpeed;
    }
    //apply Movement
    player1Y = player1Y + player1Velocity;
    //wall Constraints
    if (player1Y < 0) {
        player1Y = 0;
        player1Velocity = 0;
    }
    if (player1Y > 500) {
        player1Y = 500;
        player1Velocity = 0;
    }
    //run "UpdateAI" function
    UpdateAI();
    //the drawing logic (animation)
    ctx.fillRect(ballX - 7.5, ballY - 7.5, 15, 15); //draw the ball center with "x" as its radius
    ctx.fillRect(50, player1Y, 10, 100); //left paddle
    ctx.fillRect(790, player2Y, 10, 100); //right paddle
    requestAnimationFrame(gameLoop); //end of loop   
    //display the score
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial';
    ctx.fillText(Player1Score.toString(), 200, 100);
    ctx.fillText(Player2Score.toString(), 600, 100);
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
    if (event.key === 'upArrow') {
        upArrowIsPressed = true;
    }
    if (event.key === 'downArrow') {
        downArrowIsPressed = true;
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
    if (event.key === 'upArrow') {
        upArrowIsPressed = false;
    }
    if (event.key === 'downArrow') {
        downArrowIsPressed = false;
    }
});
