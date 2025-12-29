var gameCanvas = document.getElementById('pongCanvas');
var ctx = gameCanvas.getContext('2d');
gameCanvas.width = 1530;
gameCanvas.height = 1080;
ctx.scale(1.8, 1.8);
var gameWidth = 850;
var gameHeight = 600;
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
    var randInt = Math.random();
    if (randInt <= 0.2) {
        randInt *= 10;
    }
    if (randInt <= 0.5) {
        randInt *= 5;
    }
    else {
        randInt *= 2.5;
    }
    ballX = 850 / 2;
    ballY = 600 / 2;
    ballspeedX = 0;
    ballspeedY = 0;
    setTimeout(function () {
        ballspeedY = randInt;
        ballspeedX = direction;
    }, 1000);
}
//function that ensures the animation
function gameLoop() {
    if (Player1Score === 10) {
        ctx.textAlign = 'center';
        ctx.font = '30px "Jersey 10"';
        ctx.fillText("GAME OVER", 425, 200);
        ctx.font = '15px "Jersey 10"';
        ctx.fillText("Player 1 wins!", 425, 225);
        return;
    }
    if (Player2Score === 10) {
        ctx.textAlign = 'center';
        ctx.font = '30px "Jersey 10"';
        ctx.fillText("GAME OVER", 425, 200);
        ctx.font = '15px "Jersey 10"';
        ctx.fillText("Player 2 wins!", 425, 225);
        return;
    }
    //declaration of the ball physics
    ballX = ballX + ballspeedX;
    ballY = ballY + ballspeedY;
    //set color to everything, then draw splitting line
    ctx.fillStyle = '#ffffff';
    ctx.clearRect(0, 0, gameWidth, gameHeight); //clear the screen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.setLineDash([36.25, 15]);
    ctx.beginPath();
    ctx.moveTo(gameWidth / 2, 0);
    ctx.lineTo(gameWidth / 2, gameHeight);
    ctx.stroke();
    ctx.setLineDash([]);
    //make the ball bounce around on impact
    if (ballY - radius < 0) {
        ballY = radius;
        ballspeedY = Math.abs(ballspeedY);
    }
    if (ballY + radius > gameHeight) {
        ballY = gameHeight - radius;
        ballspeedY = -Math.abs(ballspeedY);
    }
    //score system
    if (ballX >= gameWidth) {
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
    UpdateAI();
    //the drawing logic (animation)
    ctx.beginPath();
    ctx.arc(ballX, ballY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(50, player1Y, 10, 100); //left paddle
    ctx.fillRect(790, player2Y, 10, 100); //right paddle
    requestAnimationFrame(gameLoop); //end of loop   
    //display the score
    ctx.fillStyle = '#ffffff';
    ctx.font = '50px "Jersey 10"';
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
    if (event.key === 'ArrowUp') {
        upArrowIsPressed = false;
    }
    if (event.key === 'ArrowDown') {
        downArrowIsPressed = false;
    }
});
