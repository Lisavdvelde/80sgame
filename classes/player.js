class Player{ 
        constructor() {
            this.image = new Image();
            this.image.src = 'images/kitten.png';
    
            this.position = { x: 100, y: 100 };
            this.velocity = { x: 0, y: 0 };
            this.width = 160;
            this.height = 165;
            this.sides = { bottom: this.position.y + this.height };
            this.gravity = 1;
            this.isOnGround = false; // Nieuwe variabele om te controleren of de speler op de grond is
        }
    
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    
    update() {
    this.velocity.y += this.gravity; // Zwaartekracht toepassen
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.sides.bottom = this.position.y + this.height;

    // Zorg dat de speler op de grond blijft staan
    if (this.sides.bottom > canvas.height) {
        this.velocity.y = 0;
        this.position.y = canvas.height - this.height;
    }

    // Check of de speler op een platform landt
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];

        if (detectCollision(this, platform) && this.velocity.y >= 0) {
            this.velocity.y = 0;
            this.position.y = platform.hitbox.y - this.height; // Plaats speler exact boven het platform
        }
    }
}
}

const player = new Player()