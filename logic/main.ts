export {}
const gameCanvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
const ctx = gameCanvas.getContext('2d')!
//ball settings
let ballX: number = 425
let ballY: number = 300
let ballspeedX: number = 2
let ballspeedY: number = 2
let radius: number = 7.5 //half of 15, since 15 is the diameter of the cube
//player 1 controls
let player1Y: number = 250
let wKeyIsPressed: boolean = false
let sKeyIsPressed: boolean = false
let P1slowDown: boolean = false
//player 2 controls
let player2Y: number = 250
let upArrowIsPressed: boolean = false
let downArrowIsPressed: boolean = false
//computer AI variables
let computerSpeed: number = 3.5; // 0 = Off, 2 = Easy, 3 = Normal, 3.5 = Hard

//right paddle "AI"
    function UpdateAI() {
        if (ballX <= 375) {
    return;
}
        let paddleCenter: number = player2Y + 50
        const deadzone: number = 10
    if (ballY >= paddleCenter + deadzone) { //Move down
        player2Y = player2Y + computerSpeed
    }
    if (ballY <= paddleCenter - deadzone) { //move up
        player2Y = player2Y - computerSpeed
    }
// AI limitations
    if (player2Y <= 0) {
        player2Y = 0
    }
    if (player2Y >= 500) {
        player2Y = 500
    }
    }
;

//function that ensures the animation
function gameLoop () { //declaration of the ball physics
    ctx.fillStyle = '#ffffff'
    ctx.clearRect(0,0, gameCanvas.width, gameCanvas.height);
    ballX = ballX + ballspeedX
    ballY = ballY + ballspeedY
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
//1. Player 1
    if (ballX - radius <= 60 && ballX - radius >= 50) {
        if (ballY >= player1Y && ballY <= player1Y + 100) {
            ballspeedX = Math.abs(ballspeedX); 
            
            let deltaY = ballY - (player1Y + 50);
            ballspeedY = deltaY * 0.1;
        }
    }

// 2. Player 2 / AI
    if (ballX + radius >= 790 && ballX + radius <= 800) {
        if (ballY >= player2Y && ballY <= player2Y + 100) {
            ballspeedX = -Math.abs(ballspeedX);
            
            let deltaY = ballY - (player2Y + 50);
            ballspeedY = deltaY * 0.1;
        }
    }
//Player 1 physics and limitations
let currentSpeed = P1slowDown ? 2 : 3;
        if (wKeyIsPressed && player1Y > 0) {
            player1Y = player1Y - currentSpeed
        }
        if (sKeyIsPressed && player1Y >= 0) {
            player1Y = player1Y + currentSpeed
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
    ctx.fillRect(ballX -7.5, ballY -7.5, 15, 15); //draw the ball center with "x" as its radius
    ctx.fillRect(50, player1Y, 10, 100); //left paddle
    ctx.fillRect(790, player2Y, 10, 100); //right paddle
    requestAnimationFrame(gameLoop); //end of loop
    
}
gameLoop();

//definition of the controls
document.addEventListener ('keydown', (event) => { //checks if the key is "pressed", if yes = true
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

document.addEventListener ('keyup', (event) => { //checks if the key is "pressed", if no = false
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
