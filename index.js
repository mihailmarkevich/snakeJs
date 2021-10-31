const map = document.getElementById('map');
const mapWidth = map.offsetWidth;
const mapHeight = map.offsetHeight;

const snakeWidth = 20;
const snakeHeight = 20;

const appleWidth = 40;
const appleHeight = 40;

var direction = 'left';

var snake = [];
var snakeMoving;

var apple = {
    x: 0,
    y: 0,
};

var teleport = false;

var score = 0;

gameStart();

function gameStart() {
    score = 0;

    direction = 'left';

    document.getElementById('game-over-modal').style.display = 'none';

    document.addEventListener('keyup', function (e) {
        if (e.code == 'ArrowLeft' && direction != 'right'){
            direction = 'left';
        }
        if (e.code == 'ArrowUp' && direction != 'down'){
            direction = 'up';
        }
        if (e.code == 'ArrowRight' && direction != 'left'){
            direction ='right';
        }
        if (e.code == 'ArrowDown' && direction != 'up'){
            direction = 'down';
        }
    });

    initApple();

    initSnake();
}

function gameOver() {
    clearInterval(snakeMoving);
    document.getElementById('game-over-modal').style.display = 'block';
    document.getElementById('score').innerText = score;

    document.querySelectorAll('.snake').forEach(e => e.remove());
    snake = [];
}

function initSnake() {
    var startX = mapWidth / 2;
    var startY = mapHeight / 2;

    for (var i = 0; i < 3; i++){
        var xPos = startX + snakeWidth * i;
        var yPos = startY;

        snake[i] = {
            x: xPos,
            y: yPos,
            direction: direction,
        };

        createSnakeTale(i);
    }

    moveSnake();
}

function createSnakeTale(index) {
    var snakeHTML = document.createElement('div');
    if (index == 0){
        snakeHTML.setAttribute('id', 'snake-head');
        snakeHTML.classList.add('direction-' + direction);
        var img = document.createElement('img');
        img.setAttribute('src', 'snake-head.png');
        snakeHTML.appendChild(img);
    }
    snakeHTML.classList.add('snake');
    snakeHTML.style.left = snake[index]['x'] + 'px';
    snakeHTML.style.top = snake[index]['y'] + 'px';
    map.appendChild(snakeHTML);
}

function moveSnake() {
    snakeMoving = setInterval(function () {
        // Move Head
        var prevX = snake[0]['x'];
        var prevY = snake[0]['y'];
        var prevDirection = snake[0]['direction'];

        //Is snake crushed
        for (index in snake){
            if (index > 0) {
                if (direction == 'left' && prevX == (parseFloat(snake[index]['x']) + parseFloat(snakeWidth)) && prevY == snake[index]['y']) {
                    gameOver();
                    return;
                } else if (direction == 'up' && prevX == snake[index]['x'] && prevY == (parseFloat(snake[index]['y']) + parseFloat(snakeHeight))) {
                    gameOver();
                    return;
                } else if (direction == 'right' && (parseFloat(prevX) + parseFloat(snakeWidth)) == snake[index]['x'] && prevY == snake[index]['y']){
                    gameOver();
                    return;
                } else if (direction == 'down' && prevX == snake[index]['x'] && (parseFloat(prevY) + parseFloat(snakeWidth)) == snake[index]['y']){
                    gameOver();
                    return;
                }
            }
        }

        if (snake) {
            snake[0]['direction'] = direction;

            if (snake[0]['x'] <= 0 && !teleport) {
                snake[0]['x'] = parseFloat(mapWidth) - parseFloat(snakeWidth);
                teleport = true;
            } else if ((parseFloat(snake[0]['x'] + parseFloat(snakeWidth))) >= mapWidth && !teleport) {
                snake[0]['x'] = 0;
                teleport = true;
            } else if (snake[0]['y'] <= 0 && !teleport) {
                snake[0]['y'] = parseFloat(mapHeight) - parseFloat(snakeHeight);
                teleport = true;
            } else if ((parseFloat(snake[0]['y']) + parseFloat(snakeHeight)) >= mapWidth && !teleport) {
                snake[0]['y'] = 0;
                teleport = true;
            } else if (direction == 'left') {
                snake[0]['x'] -= snakeWidth;
                teleport = false;
            } else if (direction == 'up') {
                snake[0]['y'] -= snakeHeight;
                teleport = false;
            } else if (direction == 'right') {
                snake[0]['x'] += snakeWidth;
                teleport = false;
            } else if (direction == 'down') {
                snake[0]['y'] += snakeHeight;
                teleport = false;
            }

            var elem = document.getElementsByClassName('snake')[0];
            elem.setAttribute('class', 'snake direction-' + direction);
            elem.style.left = snake[0]['x'] + 'px';
            elem.style.top = snake[0]['y'] + 'px';

            //Move Body
            for (key in snake) {
                if (key > 0) {
                    var xPos = prevX;
                    var yPos = prevY;
                    var newWirection = prevDirection;

                    prevX = snake[key]['x'];
                    prevY = snake[key]['y'];
                    prevDirection = snake[key]['direction'];

                    snake[key]['x'] = xPos;
                    snake[key]['y'] = yPos;
                    snake[key]['direction'] = newWirection;

                    var elem = document.getElementsByClassName('snake')[key];
                    elem.style.left = xPos + 'px';
                    elem.style.top = yPos + 'px';
                }
            }

            //Detect eat apple
            if (
                (apple['x'] <= snake[0]['x'] && (parseFloat(apple['x']) + parseFloat(appleWidth)) >= snake[0]['x'])
                &&
                (apple['y'] <= snake[0]['y'] && (parseFloat(apple['y']) + parseFloat(appleHeight)) >= snake[0]['y'])
            ) {
                eatApple();
            }

        }

    }, 100);
}

function initApple(){
    var coordXMin = 0;
    var coordXMax = mapWidth - appleWidth;
    apple['x'] = rand(coordXMin, coordXMax);

    var coordYMin = 0;
    var coordYMax = mapHeight - appleHeight;
    apple['y'] = rand(coordYMin, coordYMax);

    var appleHtml = document.getElementById('apple');
    if (!appleHtml){
        appleHtml = document.createElement('img');
        appleHtml.setAttribute('id', 'apple');
        appleHtml.setAttribute('src', 'apple.png');
    }
    appleHtml.style.left = apple['x'] + 'px';
    appleHtml.style.top = apple['y'] + 'px';
    map.appendChild(appleHtml);
}

function eatApple() {
    score++;
    initApple();
    increaseSnake();
}

function increaseSnake(){
    var lastTale = snake[snake.length - 1];

    var xPos = lastTale.x;
    var yPos = lastTale.y;
    var taleDirection = lastTale.direction;

    if (direction == 'left') {
        xPos += snakeWidth;
    } else if (direction == 'up'){
        yPos += snakeHeight;
    } else if (direction == 'right'){
        xPos -= snakeWidth;
    } else if (direction == 'down'){
        yPos -= snakeHeight;
    }

    snake.push({
        x: xPos,
        y: yPos,
        direction: taleDirection,
    });

    createSnakeTale(snake.length - 1);
}


function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}