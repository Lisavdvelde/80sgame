window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case ' ':
            if (player.velocity.y === 0) { // Alleen springen als de speler op de grond staat
                player.velocity.y = -20; // Springkracht
            }
            break;
        case 'a':
            keys.a.pressed = true; // Beweging naar links
            break;
        case 'd':
            keys.d.pressed = true; // Beweging naar rechts
            break;
    }
});

//Wanneer de toets wordt losgelaten, stopt de beweging
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})
