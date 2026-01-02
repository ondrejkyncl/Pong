//whatever you want to call these ig
const gameCanvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
const ctx = gameCanvas.getContext('2d')!
gameCanvas.width = 1530
gameCanvas.height = 1080
ctx.scale(1.8, 1.8);
const gameWidth = 850;
const gameHeight = 600
const restartBtn = document.getElementById('restartButton') as HTMLButtonElement;
let animationId: number
let resetTimeout: number
let hasGameStarted: boolean = false;
let startScreenId: number
let escKeyHoldStart: number = 0;
const exitduration: number = 1500
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
let computerSpeed: number = 2; // 0 = Off, 2 = Easy, 3 = Normal, 3.5 = Hard
//acceleration/decceleration
let player1Velocity: number = 0;
let player2Velocity: number = 0;
const acceleration: number = 0.75;
const friction: number = 0.88;
const maxSpeed: number = 3;
//keeping score
let Player1Score: number = 0
let Player2Score: number = 0
const WinningScore: number = 10

//right paddle "AI"
    function UpdateAI() {
        if (ballX <= 375) {
            player2Velocity = player2Velocity * friction;
            player2Y = player2Y + player2Velocity
    return;
}
        let paddleCenter: number = player2Y + 50
        const deadzone: number = 10
    if (ballY >= paddleCenter + deadzone) { //move down
        player2Velocity = player2Velocity + acceleration;
    }
    else if (ballY <= paddleCenter - deadzone) { //move up
        player2Velocity = player2Velocity - acceleration;
    }
    else {
        player2Velocity = player2Velocity * 0.8;
    }
    
    if (player2Velocity > computerSpeed) { player2Velocity = computerSpeed; }
    if (player2Velocity < -computerSpeed) { player2Velocity = -computerSpeed; }

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
function resetBall (direction: number) {
    let randInt = Math.random()
    if (randInt <= 0.2) {
        randInt *= 10
    }

    if (randInt <= 0.5) {
        randInt *= 5
    } 
    else {
        randInt *= 2} 
    ballX = gameWidth/2
    ballY = gameHeight/2
    ballspeedX = 0
    ballspeedY = 0
    resetTimeout = window.setTimeout(() => {
        ballspeedY = randInt
        ballspeedX = direction
    }, 1000);
}

function drawStartScreen () {
    ctx.fillStyle = '#ffffff'
    ctx.clearRect (0, 0, gameWidth, gameHeight)

    ctx.fillRect(50, 300-50, 10, 100); //left paddle
    ctx.fillRect(790, 300-50, 10, 100); //right paddle

    ctx.beginPath()
    ctx.arc(ballX, ballY, radius, 0, Math.PI * 2)
    ctx.fill ();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 4;
    ctx.setLineDash ([36.25, 15])
    ctx.beginPath();
    ctx.moveTo (gameWidth / 2, 0)
    ctx.lineTo(gameWidth / 2, gameHeight)
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '50px "Jersey 10"'
    ctx.textAlign = 'start'
    ctx.fillText(Player1Score.toString(), 200, 100)
    ctx.fillText(Player2Score.toString(), 600, 100)

    if (Date.now () % 1500 < 1000) {
    ctx.font = '25px "Jersey 10"';
    ctx.fillStyle = 'rgba(255, 255, 255, .75)'
    ctx.textAlign = 'left'

    ctx.fillText("Click to start", 20, gameHeight - 20)
    }
    if (!hasGameStarted) {
        startScreenId = requestAnimationFrame(drawStartScreen);
    }
}

function gameLoop () {
//check for the score, if it matches "WinningScore", display the text
    if (Player1Score === WinningScore) {
        ctx.textAlign = 'center'
        ctx.font = '30px "Jersey 10"';
        ctx.fillText ("GAME OVER", 425, 200);

        ctx.font = '15px "Jersey 10"';
        ctx.fillText ("Player 1 wins!", 425, 225);

        restartBtn.style.display = 'block';
        return;
}
    if (Player2Score === WinningScore) {
        ctx.textAlign = 'center'
        ctx.font = '30px "Jersey 10"';
        ctx.fillText ("GAME OVER", 425, 200);

        ctx.font = '15px "Jersey 10"';
        ctx.fillText ("Player 2 wins!", 425, 225);

        restartBtn.style.display = 'block';
        return;
}
//declaration of the ball physics
    ballX = ballX + ballspeedX
    ballY = ballY + ballspeedY 
//set color to everything, then draw splitting line
    ctx.fillStyle = '#ffffff'
    ctx.clearRect(0,0, gameWidth, gameHeight); //clear the screen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 4;
    ctx.setLineDash ([36.25, 15])
    ctx.beginPath();
    ctx.moveTo (gameWidth / 2, 0)
    ctx.lineTo(gameWidth / 2, gameHeight)
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
        Player1Score ++
        ballspeedX = 2
        resetBall(2)
    }
    if (ballX <= 0) {
        Player2Score ++
        ballspeedX = -2

        resetBall(-2)
    }
//collisions
//1. Player 1
    if (ballX < 60 + radius && ballX > 50 - radius && ballY > player1Y - radius && ballY < player1Y + 100 + radius) {
        if ( ballY >= player1Y && ballY <= player1Y + 100) {
            ballspeedX = Math.abs(ballspeedX)

            let deltaY = ballY - (player1Y + 50);
            ballspeedY = deltaY * 0.1;

            ballX = 60 + radius;
        }
        else {
            ballspeedY = -ballspeedY;

            if (ballY < player1Y + 50) {
                ballY = player1Y - radius - 1;
            }
            else {
                ballY = player1Y + 100 + radius + 1
            }
        }
    }
// 2. Player 2 / AI
    if (ballX > 790 - radius && ballX < 800 + radius && ballY > player2Y - radius && ballY < player2Y + 100 + radius) {
        if (ballY >= player2Y && ballY <= player2Y + 100) {
            ballspeedX = -Math.abs(ballspeedX);
        
        let deltaY = ballY - (player2Y + 50);
        ballspeedY = deltaY * 0.1;

        ballX = 790 - radius;
    } 
    else {
        ballspeedY = -ballspeedY;
        
        if (ballY < player2Y + 50) { 
            ballY = player2Y - radius - 1;
        }
        else {
            ballY = player2Y + 100 + radius + 1;
        }
    }
}
//Player 1 physics and limitations
let currentMaxSpeed = P1slowDown ? 3 : maxSpeed;
let currentAccel = P1slowDown ? 0.2 : acceleration;

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
    ctx.arc(ballX, ballY, radius, 0, Math.PI * 2)
    ctx.fill ();
    ctx.fillRect(50, player1Y, 10, 100); //left paddle
    ctx.fillRect(790, player2Y, 10, 100); //right paddle

//exit function
if (escKeyHoldStart > 0) {
    const currentHoldTime = Date.now() -escKeyHoldStart;
    const opacity = Math.min(currentHoldTime / exitduration)
    
    ctx.font = '25px "Jersey 10"'
    ctx.textAlign = 'left'

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
    ctx.fillText("Hold ESC to exit", 20, gameHeight - 20)

    if (currentHoldTime >= exitduration) {
        window.close();
    }
}
    animationId = requestAnimationFrame(gameLoop); //end of loop   
//display the score
ctx.fillStyle = '#ffffff'
ctx.font = '50px "Jersey 10"'
ctx.textAlign = 'start'
ctx.fillText(Player1Score.toString(), 200, 100)
ctx.fillText(Player2Score.toString(), 600, 100)
}
drawStartScreen()
//definition of the controls
document.addEventListener ('keydown', (event) => { //checks if the key is pressed, if yes = true
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
        if (event.key === 'Escape') {
            if (escKeyHoldStart === 0) {
                escKeyHoldStart = Date.now();
            }
        }
});

document.addEventListener ('keyup', (event) => { //checks if the key is pressed, if no = false
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
            if (event.key === 'Escape') {
            escKeyHoldStart = 0
    }
});

restartBtn.addEventListener ('click', () => {

    clearTimeout(resetTimeout)
    cancelAnimationFrame(animationId)

    Player1Score = 0
    Player2Score = 0

    restartBtn.style.display = 'none'

    resetBall(2)
    gameLoop();
});

gameCanvas.addEventListener ('click', () => {
    if (!hasGameStarted) {
        cancelAnimationFrame(startScreenId)
        hasGameStarted = true;
        gameLoop()
        resetBall(2)
    }
});