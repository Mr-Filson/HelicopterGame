var heli;
var pole1;
var pole2;
var scoreSpan;
var speedSpan;
var speed;
var score;
var flapping;
var playing;
var scoreUpdated;
var gameArea;
var restartBtn;
var containerWidth;
var containerHeight;
var fuel;
var fuelSpan;

function load() {
    heli = document.getElementById("heli")
	fuel = document.getElementById("fuel")
    poles = document.querySelectorAll(".pole")
    pole1 = document.getElementById("pole-1")
    pole2 = document.getElementById("pole-2")
    scoreSpan = document.getElementById("score")
    speedSpan = document.getElementById("speed")
	fuelSpan = document.getElementById("fuel")
    gameArea = document.getElementById("game-area");
    restartBtn = document.getElementById("restart-btn");
    containerWidth = gameArea.clientWidth;
    containerHeight = gameArea.clientHeight;

    gameArea.addEventListener("mousedown", function (e) {
        if (playing) {
            flapping = true;
        }
    });

    gameArea.addEventListener("mouseup", function (e) {
        if (playing) {
            flapping = false;
        }
    });
}

function restart() {
    restartBtn.removeEventListener('click', restart);
    speed = 1;
    score = 0;
	fuel = 100;
    scoreUpdated = false;
    flapping = false;
    playing = true;
    speedSpan.textContent = speed;
    scoreSpan.textContent = score;
	fuelSpan.textContent = fuel;
    poles.forEach((pole) => {
        pole.style.right = 0;
    });
    heli.style.top = 20 + "%";
    gameLoop();
}

function update() {

    var polesCurrentPos = parseFloat(window.getComputedStyle(poles[0]).getPropertyValue("right"));

    if (polesCurrentPos > containerWidth * 0.85) {
        if (!scoreUpdated) {
            score += 1;
            scoreUpdated = true;
        }
        scoreSpan.textContent = score;
    }

    if (polesCurrentPos > containerWidth) {

        var newHeight = parseInt(Math.random() * 100);
        pole1.style.height = 100 + newHeight + "px";
        pole2.style.height = 100 - newHeight + "px";

        polesCurrentPos = 0;

        speed += 0.25;
		fuel -= 1;
        speedSpan.textContent = parseInt(speed);
		fuelSpan.textContent = parseInt(fuel);
        scoreUpdated = false;
    }

    poles.forEach((pole) => {
        pole.style.right = polesCurrentPos + speed + "px";
    });

    let heliTop = parseFloat(window.getComputedStyle(heli).getPropertyValue("top"));
    if (flapping) {
        heli.style.top = heliTop + -2 + "px";
    } else if (heliTop < containerHeight - heli.clientHeight) {
        heli.style.top = heliTop + 3 + "px";
    }

    if (collision(heli, pole1) || collision(heli, pole2) || heliTop <= 0 || heliTop > containerHeight - heli.clientHeight) {
        gameOver();
    }
	if (fuel <= 0) {
		window.console.log("ran out of fuel");
		gameOver();
	}
}

function gameOver() {
    window.console.log("game over");
    playing = false;
    restartBtn.addEventListener('click', restart);
}

function gameLoop() {
    update();
    if (playing) {
        requestAnimationFrame(gameLoop);
    }
}

function collision(gameDiv1, gameDiv2) {
    let left1 = gameDiv1.getBoundingClientRect().left;
    let top1 = gameDiv1.getBoundingClientRect().top;
    let height1 = gameDiv1.clientHeight;
    let width1 = gameDiv1.clientWidth;

    let bottom1 = top1 + height1;
    let right1 = left1 + width1;
    let left2 = gameDiv2.getBoundingClientRect().left;
    let top2 = gameDiv2.getBoundingClientRect().top;
    let height2 = gameDiv2.clientHeight;
    let width2 = gameDiv2.clientWidth;
    let bottom2 = top2 + height2;
    let right2 = left2 + width2;

    if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2)
        return false;
    return true;
}

document.addEventListener("keydown", function (e) {
    var key = e.key;
    if (key === " " && playing) {
        flapping = true;
	}
	if (event.key === "s" && playing) {
		speed += 1;
		speedSpan.textContent = parseInt(speed);
		fuel = fuel - 5
		fuelSpan.textContent = parseInt(fuel);
    }
});

document.addEventListener("keyup", function (e) {
    e.preventDefault();
    var key = e.key;
    if (key === " " && playing) {
        flapping = false;
    }
});




load();
restart(); 