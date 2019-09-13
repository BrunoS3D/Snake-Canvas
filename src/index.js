const levelElement = document.getElementById("level");
const scoreElement = document.getElementById("score");
const fruitsElement = document.getElementById("fruits");
const canvas = document.getElementById("canvas-board");

const context = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

let trail = [];
let fruits = [];
let keymap = {};

let direction = "";

let x = 15;
let y = 15;

let level = 1;
let snakeLength = 3;
let fruitsCount = 3;

const keyDirections = {
	ArrowUp: {
		x: 0,
		y: 1
	},
	ArrowDown: {
		x: 0,
		y: -1
	},
	ArrowLeft: {
		x: -1,
		y: 0
	},
	ArrowRight: {
		x: 1,
		y: 0
	}
}

window.onload = Start;
setInterval(OnGUI, 170 / level);
addEventListener("keydown", OnKeyboardInputDown);

function Start() {
	InstantiateFruits();
}

function OnGUI() {
	OnInputGUI();
	ClearCanvas();

	fruits.forEach((pos) => {
		SetPixel(pos.x, pos.y, "red");
	});

	trail.forEach((pos) => {
		SetPixel(pos.x, pos.y, "grey");
	});

	levelElement.textContent = level;
	scoreElement.textContent = snakeLength - 3;
	fruitsElement.textContent = fruits.length;

	SetPixel(x, y, "green");
}

function OnInputGUI() {
	// gameover / start anim
	if (trail.some((pos) => pos.x === x && pos.y === y)) {
		direction = "";
		x = 15;
		y = 15;
		trail = [];
		fruits = [];
		level = 1;
		snakeLength = 3;
		fruitsCount = 3;
		InstantiateFruits();
		return;
	}
	else {
		trail.push({ x, y });
		if (trail.length > snakeLength) {
			trail.shift();
		}
	}

	if (direction) {
		const dir = keyDirections[direction];

		x += dir.x;
		y -= dir.y;

		if (x < 0) {
			x = width - 1;
		}
		else if (x >= width) {
			x = 0;
		}
		if (y < 0) {
			y = height - 1;
		}
		else if (y >= height) {
			y = 0;
		}

		const filter = fruits.filter((pos) => !(pos.x === x && pos.y === y));

		if (fruits.length !== filter.length) {
			fruits = filter;
			snakeLength++;
		}

		if (filter.length === 0) {
			level++;
			fruitsCount += 3;
			InstantiateFruits();
		}
	}
}

function OnKeyboardInputDown(event) {
	const targetDirection = keyDirections[event.key];
	if (targetDirection) {
		const currentDirection = keyDirections[direction];
		// evita que ela
		if (currentDirection && (currentDirection.x - targetDirection.x === 0 || currentDirection.y - targetDirection.y === 0)) return;

		direction = event.key;
	}
}

function InstantiateFruits() {
	for (let id = 0; id < fruitsCount; id++) {
		fruits.push({
			x: (Math.floor(Math.random() * width)),
			y: (Math.floor(Math.random() * height))
		});
	}
}

function ClearCanvas() {
	context.fillStyle = "white";
	context.fillRect(0, 0, width, height);
}

function SetPixel(coord_x, coord_y, color) {
	context.fillStyle = color;
	context.fillRect(coord_x, coord_y, 1, 1);
}