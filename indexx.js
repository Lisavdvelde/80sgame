const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

const GAME_WIDTH = 1920;
const GAME_HEIGHT = 1080;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Physics
let gravity = 0.4;
let initialVelocityY = -12;

let platformArray = [];
let platformWidth = 280;
let platformHeight = 95;
let platformImg = new Image();
platformImg.src = "/images/plateauplanten.png";

// Platforms
function placePlatforms() {
    platformArray = [];
    let yPosition = canvas.height - 250;
    let minSpacing = 150;
    let maxSpacing = 250;
    let maxJumpHeight = 200;
    
    while (platformArray.length < 6) {
        let newX = Math.random() * (canvas.width - platformWidth);
        let newY = yPosition - (minSpacing + Math.random() * (maxSpacing - minSpacing));
        
        if (newY < canvas.height - maxJumpHeight * 6) break; // Voorkomt onbereikbare platforms
        
        let overlapping = platformArray.some(platform => 
            Math.abs(platform.x - newX) < platformWidth * 0.5 &&
            Math.abs(platform.y - newY) < minSpacing
        );
        
        if (!overlapping) {
            let platform = {
                img: platformImg,
                x: newX,
                y: newY,
                width: platformWidth,
                height: platformHeight,
                hitbox: { x: newX, y: newY + 60, width: platformWidth, height: 10 }
            };
            platformArray.push(platform);
            yPosition = newY;
        }
    }
}

// Controleert of de speler in aanraking is met een platform.
function detectCollision(player, platform) {
    let hitbox = platform.hitbox;
    return (
        player.position.x < platform.x + platform.width &&
        player.position.x + player.width > platform.x &&
        player.sides.bottom > hitbox.y &&
        player.velocity.y >= 0
    );
}

// Achtergrond afbeelding
class Sprite {
    constructor({ position, imageSrc }) {
        this.position = position;
        this.image = new Image();
        this.image.onload = () => { this.loaded = true };
        this.image.src = 'achtergrondd.png';
        this.loaded = false;
    }
    draw() {
        if (!this.loaded) return;
        c.drawImage(this.image, this.position.x, this.position.y, canvas.width, canvas.height);
    }
}

// Speler zijn eigenschappen
class Player {
    constructor() {
        this.image = new Image();
        this.image.src = 'images/kitten.png';
        this.position = { x: 100, y: 500 };
        this.velocity = { x: 0, y: initialVelocityY };
        this.width = 160;
        this.height = 165;
        this.sides = { bottom: this.position.y + this.height };
        this.gravity = gravity;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.velocity.y += this.gravity;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.sides.bottom = this.position.y + this.height;

        if (this.velocity.y < 0 && this.position.y < GAME_HEIGHT / 2) {
            platformArray.forEach(platform => {
                platform.y -= this.velocity.y;
                platform.hitbox.y -= this.velocity.y;
            });
        }

        platformArray.forEach(platform => {
            if (detectCollision(this, platform)) {
                this.velocity.y = initialVelocityY; // Speler springt weer bij aanraking met platform
            }
        });
    }
}

//De speler naar links en rechts bewegen
const keys = {
    a: { pressed: false },
    d: { pressed: false }
};

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});

const player = new Player();

const background = new Sprite({ position: { x: 0, y: 0 } });

function animate() {
    window.requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);

    background.draw();
    player.update();

    player.velocity.x = 0;
    if (keys.d.pressed) player.velocity.x = 5;
    else if (keys.a.pressed) player.velocity.x = -5;

    // // brengt speler naar andere kant van het scherm
    if (player.position.x > canvas.width) {
        player.position.x = 0;
    } else if (player.position.x + player.width < 0) {
        player.position.x = canvas.width;
    }

    player.draw();

    platformArray.forEach(platform => {
        c.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    });

    platformArray = platformArray.filter(platform => platform.y < canvas.height);
    if (platformArray.length < 6) {
        let newPlatform;
        let valid = false;
        while (!valid) {
            let newX = Math.random() * (canvas.width - platformWidth);
            let newY = platformArray[0].y - (minSpacing + Math.random() * (maxSpacing - minSpacing));
            let overlapping = platformArray.some(platform => 
                Math.abs(platform.x - newX) < platformWidth * 0.5 &&
                Math.abs(platform.y - newY) < minSpacing
            );
            if (!overlapping) {
                newPlatform = {
                    img: platformImg,
                    x: newX,
                    y: newY,
                    width: platformWidth,
                    height: platformHeight,
                    hitbox: { x: newX, y: newY + 60, width: platformWidth, height: 10 }
                };
                valid = true;
            }
        }
        platformArray.push(newPlatform);
    }
}

placePlatforms();
animate();
