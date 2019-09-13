const levelElement = document.getElementById("level");
const scoreElement = document.getElementById("score");
const fruitsElement = document.getElementById("fruits");
const canvas = document.getElementById("canvas-board");

const context = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

let trail = [];
let fruits = [];

let direction = "";

let x = 15;
let y = 15;

let level = 1;
let snakeLength = 3;
let fruitsCount = 3;

// direcoes = event.key
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
	// cria as frutas em posicoes aleatorias do canvas
	InstantiateFruits();
}

function OnGUI() {
	// gameover / animacao inicial
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
		// adiciona a posicao atuao ao corpo da snake
		trail.push({ x, y });
		if (trail.length > snakeLength) {
			// remove o ultimo pixel do corpo da snake
			// dando aquela sensacao de movimento
			trail.shift();
		}
	}

	// "limpa" o canvas, na verdade sobreescreve tudo de branco
	ClearCanvas();

	// verifica alteracoes na direcao e realiza
	// a movimentacao dos pixels do corpo da snake
	OnInputGUI();

	// desenha as frutas nas tela
	fruits.forEach((pos) => {
		SetPixel(pos.x, pos.y, "red");
	});

	// desenha o corpo da snake
	trail.forEach((pos) => {
		SetPixel(pos.x, pos.y, "grey");
	});

	levelElement.textContent = level;
	scoreElement.textContent = snakeLength - 3;
	fruitsElement.textContent = fruits.length;

	// ponto de origem da snake
	SetPixel(x, y, "green");
}

function OnInputGUI() {
	// se a direcao inicial ja foi definida
	// sera realizado a movimentacao
	if (direction) {
		const dir = keyDirections[direction];

		x += dir.x;
		y -= dir.y;

		// portal para que a snake nao saia da parte visivel do canvas
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

		// pega apenas as frutas que nao estiverem na mesma posicao da snake
		const filter = fruits.filter((pos) => !(pos.x === x && pos.y === y));

		// compara e verifica se houve alteracao
		// se sim, ele aumenta o tamanho da nossa amiguinha
		if (fruits.length !== filter.length) {
			fruits = filter;
			snakeLength++;
		}

		// se nao houverem mais frutas ele nos passa de level
		if (filter.length === 0) {
			level++;
			fruitsCount += 3;
			InstantiateFruits();
		}
	}
}

function OnKeyboardInputDown(event) {
	// tecla pressionada
	const targetDirection = keyDirections[event.key];

	// se a tecla estiver na nossa lista de direcoes (keyDirections)
	if (targetDirection) {
		const currentDirection = keyDirections[direction];
		// evita que ela retorne em cima do proprio corpo
		if (currentDirection && (currentDirection.x - targetDirection.x === 0 || currentDirection.y - targetDirection.y === 0)) return;

		// define a nova direcao
		direction = event.key;
	}
}

function InstantiateFruits() {
	// cria as furtas no canvas em posicoes aleatorias
	for (let id = 0; id < fruitsCount; id++) {
		fruits.push({
			x: (Math.floor(Math.random() * width)),
			y: (Math.floor(Math.random() * height))
		});
	}
}

function ClearCanvas() {
	// preenche todo o canvas com um rect branco
	context.fillStyle = "white";
	context.fillRect(0, 0, width, height);
}

function SetPixel(coord_x, coord_y, color) {
	// desenha um pixel com uma cor definida em uma posicao do canvas
	context.fillStyle = color;
	context.fillRect(coord_x, coord_y, 1, 1);
}