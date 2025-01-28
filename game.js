const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    width: 50,
    height: 50,
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    speed: 5,
    dx: 0
};

const bullets = [];
const targets = [];

function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawTargets() {
    ctx.fillStyle = 'green';
    targets.forEach(target => {
        ctx.fillRect(target.x, target.y, target.width, target.height);
    });
}

function movePlayer() {
    player.x += player.dx;

    // Prevent the player from moving out of bounds
    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function moveBullets() {
    bullets.forEach(bullet => {
        bullet.y -= bullet.speed;
    });

    // Remove bullets that go off screen
    bullets = bullets.filter(bullet => bullet.y > 0);
}

function moveTargets() {
    targets.forEach(target => {
        target.y += target.speed;
    });

    // Remove targets that go off screen
    targets = targets.filter(target => target.y < canvas.height);
}

function detectCollisions() {
    bullets.forEach(bullet => {
        targets.forEach((target, targetIndex) => {
            if (
                bullet.x < target.x + target.width &&
                bullet.x + bullet.width > target.x &&
                bullet.y < target.y + target.height &&
                bullet.height + bullet.y > target.y
            ) {
                // Remove the target and the bullet
                targets.splice(targetIndex, 1);
                bullets.splice(bullets.indexOf(bullet), 1);
            }
        });
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    moveBullets();
    moveTargets();
    detectCollisions();

    drawPlayer();
    drawBullets();
    drawTargets();

    requestAnimationFrame(update);
}

function shoot() {
    const bullet = {
        width: 5,
        height: 10,
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        speed: 7
    };
    bullets.push(bullet);
}

function addTarget() {
    const target = {
        width: 50,
        height: 50,
        x: Math.random() * (canvas.width - 50),
        y: 0,
        speed: 2
    };
    targets.push(target);
}

function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        player.dx = player.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        player.dx = -player.speed;
    } else if (e.key === ' ') {
        shoot();
    }
}

function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

setInterval(addTarget, 1000); // Add a new target every second
update();
