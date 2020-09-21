const canvas = document.getElementById("game");
const ctx = canvas.getContext('2d');

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "#d3e9e5"
}

const user = {
    x: 0,
    y: (canvas.height - 100) / 2, //100 width of panel
    width: 10,
    height: 100,
    score: 0,
    color: "BLACK"
}

const com = {
    x: canvas.width - 10,
    y: (canvas.height - 100) / 2,
    width: 10,
    height: 100,
    score: 0,
    color: "BLACK"
}

const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "WHITE"
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true); //0 is angle and x&y are measured from center 
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse
canvas.addEventListener("mousemove", mousePosition);

function mousePosition(evt) {
    let rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height / 2;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 10;
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}


function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update() {

    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    }
    else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }

    // the ball has a velocity
    //The game is called 50 times per second(frame rate) so distance of ball 
    //(ball.x & ball.y) is increasing continuously
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // simple AI for computer movements
    //Position the paddle according to position of ball but with increasing speed of ball, 
    //the computer factor will help the computer lose
    com.y += ((ball.y - (com.y + com.height / 2))) * 0.1;

    //ball colliding with side walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;

    }

    // we check if the paddle hit the user or the com paddle
    let player=(ball.x + ball.radius < canvas.width / 2) ? user:com;


    // if the ball hits a paddle
    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height / 2);
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI / 4) * collidePoint;

        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // speed up the ball everytime a paddle hits it.
        ball.speed += 1;
    }
}

// render function, the function that does al the drawing
function render() {

    drawRect(0, 0, canvas.width, canvas.height, "#0526B0");

    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
    drawNet();

    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);


}
function game() {
    update();
    render();
}
// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop = setInterval(game, 1000 / framePerSecond);