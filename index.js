const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

const GAME_WIDTH = 1920;
const GAME_HEIGHT = 1080;

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

//physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

let platformArray = [];
let platformWidth = 280;
let platformHeight = 95;
let platformImg; 
 
platformImg = new Image ();

platformImg.src = "/images/plateauplanten.png"

velocityY = initialVelocityY;

placePlatforms();

function placePlatforms() {
    platformArray = [];

    console.log (canvas.height)
    //starting platforms
    let platform = {
        img: platformImg,
        x: (canvas.width / 2), 
        y: canvas.height -250,
        width : platformWidth,
        height : platformHeight,
        hitbox: {
            x: (canvas.width / 2),  
            y: canvas.height - 250 + 60, 
            width: platformWidth,
            height: 10, 
        }

    }

    platformArray.push(platform);

    platform = {
        img: platformImg,
        x: (canvas.width / 2), 
        y: canvas.height -500,
        width : platformWidth,
        height : platformHeight,
        hitbox: {
            x: (canvas.width / 2),  
            y: canvas.height - 500 + 60, 
            width: platformWidth,
            height: 10, 
        }
    }

    platformArray.push(platform);


}

function detectCollision(player, platform) {
    let hitbox = platform.hitbox; 
    return (
        player.position.x < platform.x + platform.width &&
        player.position.x + player.width > platform.x &&
        player.position.y + player.height > platform.y && // De speler is onder de bovenkant van het platform
        player.position.y + player.height - player.velocity.y < platform.y + platform.height // Extra check voor 'bovenop het platform'
    );
}

const achtergrond = new Sprite({
    position: {
        x: 0,
        y: 0,
    }
})

const keys = {
     space: {
        pressed: false
     },
     a: {
        pressed: false
     },
     d: {
        pressed: false
     }
}

function animate() {
    window.requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height); // Verwijder oude frames

    achtergrond.draw();
    player.update();

    player.velocity.x = 0;
    if (keys.d.pressed) player.velocity.x = 5;
    else if (keys.a.pressed) player.velocity.x = -5;

    // Wrap around screen
    if (player.position.x > canvas.width) {
        player.position.x = 0;
    } else if (player.position.x + player.width < 0) {
        player.position.x = canvas.width;
    }


    player.draw();
    
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (detectCollision(player, platform)) {
            player.velocity.y = 0;
            player.position.y = platform.hitbox.y - player.height; // Zorg dat de speler op het platform blijft staan
        }
        c.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }
    
    
}

animate() 