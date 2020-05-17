var TO_RADIANS = Math.PI / 180;
var PHRASES = [
    'Хихихи-хахаха!',
    'Где рыжий киоск!?',
    'Прекрасно!',
    'Славян бы заценил!',
    'Неееет! Ну ладно...',
    'Такой хуйни я еще не видел!',
]

let startWithoutMusic = function() {
    let start = document.getElementsByClassName('start')[0].classList;
    start.remove('show');
    start.add('hidden');

    let gameOver = document.getElementsByClassName('gameOver')[0].classList;
    gameOver.remove('show');
    gameOver.add('hidden');

    let game = document.getElementsByClassName('game')[0].classList;
    game.remove('hidden');
    game.add('show');
    init();
}

let start = function() {
    startWithoutMusic();
    soundMiss = new Sound('miss.mp3');
    soundWall = new Sound('wall.mp3');
    soundFon = new Sound('fon.mp3');
    soundFon.play();
    soundFon.sound.onended=function(){
        soundFon2 = new Sound('fon2.mp3');
        soundFon2.play();
    };

}

let gameOver = function(num) {
    let str = `Ваша печень отбила ${num} ударов. Вы в говно, т.к. пропустили 6 по 0.5. Если вы не Егор, то хорошо держались)`;

    let game = document.getElementsByClassName('game')[0].classList;
    game.remove('show');
    game.add('hidden');

    let gameOver = document.getElementsByClassName('gameOver')[0].classList;
    gameOver.remove('hidden');
    gameOver.add('show');


    document.getElementsByClassName('shit')[0].textContent = str;
}

let init = function() {
    canvas = document.getElementById('canvas');
    canvas.width = 480;
    canvas.height = 320;
    context = canvas.getContext('2d');
    context.fillStyle = "#222";
    player = new Item ('#fff', 10, 10, 20, 70);
    wallTop = new Item ('#d42929', 0, 0, 480, 10);
    wallRight = new Item ('#d42929', 470, 10, 10, 300);
    wallBottom = new Item ('#d42929', 0, 310, 480, 10);
    ball = new Ball(60, 50, 5, 1);
    update();
    canvas.onmousemove = plaerMove;

}

class Sound {
    constructor(src){
        this.sound = document.createElement('audio');
        this.sound.src = src;
        this.sound.setAttribute('preload', 'auto');
        this.sound.setAttribute('controls', 'none');
        this.sound.style.display = 'none';
        document.body.appendChild(this.sound);
    }

    play() {
        this.sound.play();
    }

    stop() {
        this.sound.stop();
    }
}

class Item {
    constructor (color, x, y, width, height) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    create() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height); 
    }

}

class Ball {
    constructor(x, y, vx, vy) {
        var that = this;
        this.img = new Image();
        this.img.src = 'ball.png';
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.diff = vx;
        this.angle = 0;
        this.i = 0;

        this.img.onload = function() {
            setInterval(() => {
                if (that.i <= 360) {
                    that.i += 20;
                } else {
                    that.i = 40;
                }
                imageRotate(
                    that.img, 
                    that.x, 
                    that.y, 
                    that.i
                    );

                that.x += that.vx;
                that.y += that.vy;
                update();
            },20);
        }
    }

    update() {
        imageRotate(
                    this.img, 
                    this.x, 
                    this.y, 
                    this.i
                );
    } 

    checkMiss() {
        if (this.x + 64 < 0) {
            this.x = 60;
            this.y = 50;
            this.vx = 0;
            this.vy =0;
            let rnd = Math.floor(Math.random() * 4 + 4);
            soundMiss.play();
            let lives = document.getElementsByClassName('beer').length;
            if (lives) {
                document.getElementsByClassName('beer')[0].remove();
                document.getElementsByClassName('says')[0].textContent = PHRASES[lives - 1];
                setTimeout(() => {
                    this.vy = this.diff - rnd;
                    this.vx = this.diff;
                }, 1500);
            } else {
                document.getElementsByClassName('lives')[0].insertAdjacentHTML('beforeend','<div class="beer"></div>'.repeat(6))
                gameOver(this.diff - 5);
            }
            
        }
    }
}

let collisionWall = function(objA) {
    if (objA.x + 16 > canvas.width - 10 && objA.vx > 0) {
        objA.vx = -objA.vx;
    }
    if (objA.y + 16 > canvas.height - 10 && objA.vy > 0 ||
        objA.y - 16 < 10 && objA.vy < 0) {
            objA.vy = -objA.vy;
        }

    objA.checkMiss();
}

let collision = function(objA, objB) {
    if(objA.x - 16 <= objB.x + 30 &&
        objB.y + 10 < objA.y + 10 &&
        objB.y + 80 > objA.y - 10 && 
        objA.vx < 0) {
        ball.vx = -ball.vx;
        ball.diff++;
        ball.vx++;
        ball.vy > 0 ? ball.vy++ : ball.vy--;
        soundWall.play();
    }
}


let imageRotate = function(image, x, y, angle) {
	context.save(); 
	context.translate(x, y);
	context.rotate(angle * TO_RADIANS);
	context.drawImage(image, -(image.width/2), -(image.height/2));
    context.restore(); 
}

let update = function() {
    context.fillStyle = "#222";
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.create();
    wallTop.create();
    wallRight.create();
    wallBottom.create();
    ball.update();
    collisionWall(ball);
    collision(ball, player);
}

let plaerMove = function(e) {
    let Y = e.clientY - 80;
    const height = canvas.height;
    
    if (Y + 35 <= height && Y - 55 > 0) {
        player.y = Y - 45;
        update();
    }
    
}