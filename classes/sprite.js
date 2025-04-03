class Sprite {
    constructor({position, imageSrc}) {
        this.position = position
        this.image = new Image ()
        this.image.onload = () => {
            this.loaded = true
        }
        this.image.src = 'achtergrondd.png'
        this.loaded = false
    }
    draw() {
        if (!this.loaded) return
        c.drawImage(this.image, this.position.x, this.position.y, canvas.width, canvas.height)
    }
}
