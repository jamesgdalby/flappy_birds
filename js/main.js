var config = { 
	backgroundColor: "#FF0000",
	deadRotationSpeed: 10,
	flapPower: 5,
	gameSpeed: 1, 
	gravity: 0.3,
	height: 512, 
	initPipeHeight: 175,
	scoreNumberSpacing:13,
	scoreNumberHeight:450,
	type:Phaser.AUTO, 
	width: 288
};

var flappyBird = {}
var game;
var baseImages;
var pipes = [];
var bird;
var birdVelocity;
var score = 0;
var gameOverImage = null;

var sounds = {
	die:null,
	hit:null,
	point:null,
	swoosh:null,
	wing:null,
}

var states = {
	isPlaying:true, 
	isDying:false, 
	isGameOver:false
}

var scoreNumbers = {
	ones0:null,
	ones1:null,
	ones2:null,
	ones3:null,
	ones4:null,
	ones5:null,
	ones6:null,
	ones7:null,
	ones8:null,
	ones9:null,
	tens1:null,
	tens2:null,
	tens3:null,
	tens4:null,
	tens5:null,
	tens6:null,
	tens7:null,
	tens8:null,
	tens9:null,
}

window.onload = function(){
	game = new Phaser.Game(config.width, config.height, config.type);
	game.state.add("Game", flappyBirdsGame);
	game.state.start("Game");
}

var flappyBirdsGame = function(){}

flappyBirdsGame.prototype = {
	preload:preload, 
	create:create, 
	update:update, 
	input:input, 
	gameOver:gameOver, 
	onPipeHit:onPipeHit
}

function preload() {

	// load images
	
	this.load.image('0', 'assets/images/0.png');
	this.load.image('1', 'assets/images/1.png');
	this.load.image('2', 'assets/images/2.png');
	this.load.image('3', 'assets/images/3.png');
	this.load.image('4', 'assets/images/4.png');
	this.load.image('5', 'assets/images/5.png');
	this.load.image('6', 'assets/images/6.png');
	this.load.image('7', 'assets/images/7.png');
	this.load.image('8', 'assets/images/8.png');
	this.load.image('9', 'assets/images/9.png');
	this.load.image('background-day', 'assets/images/background-day.png');
	this.load.image('background-night', 'assets/images/background-night.png');
	this.load.image('base', 'assets/images/base.png');
	this.load.image('gameover', 'assets/images/gameover.png');
	this.load.image('message', 'assets/images/message.png');
	this.load.image('pipe-green', 'assets/images/pipe-green.png');
	this.load.image('pipe-red', 'assets/images/pipe-red.png');

	// load spritesheet

	this.load.spritesheet('bird-blue', 'assets/images/bird_blue.png', 34, 24, 3)
	this.load.spritesheet('bird-red', 'assets/images/bird_red.png', 34, 24, 3)
	this.load.spritesheet('bird-yellow', 'assets/images/bird_yellow.png', 34, 24, 3)

	// load audio

	this.load.audio('die', 'assets/audio/die.ogg');
	this.load.audio('hit', 'assets/audio/hit.ogg');
	this.load.audio('point', 'assets/audio/point.ogg');
	this.load.audio('swoosh', 'assets/audio/swoosh.ogg');
	this.load.audio('wing', 'assets/audio/wing.ogg');
}

function create() {
	game.stage.backgroundColor = config.backgroundColor;
	
	// bg

	var bg = this.add.image(0, 0, 'background-day');
	bg.anchor.x = 0;
	bg.anchor.y = 0;

	// pipes

	var pipe1 = new Pipe(this, 'green');
	pipe1.init();
	
	var pipe2 = new Pipe(this, 'green');
	pipe2.init();

	pipes = [pipe1, pipe2];
	initPipePositions();

	// base images

	var base1 = this.add.image(0, config.height-112, 'base');
	base1.anchor.x = 0;
	base1.anchor.y = 0;
	
	var base2 = this.add.image(base1.width, config.height-112, 'base');
	base2.anchor.x = 0;
	base2.anchor.y = 0;
	
	baseImages = [base1, base2];

	// bird

	bird = game.add.sprite(config.width/2, config.height/2, 'bird-yellow')
	bird.anchor.x = 0.5;
	bird.anchor.y = 0.5;
	bird.animations.add('flap', [1,2,3], 15);
	bird.animations.add('idle');

	birdVelocity = 0;

	// score
	
	var i = 0;
	for(i = 0; i<=9; i++){
		scoreNumbers['ones' + i] = game.add.image(config.width/2 + config.scoreNumberSpacing, config.scoreNumberHeight, (""+i));
	}

	for(i = 1; i<=9; i++){
		scoreNumbers['tens' + i] = game.add.image(config.width/2 - config.scoreNumberSpacing, config.scoreNumberHeight, (""+i));
	}

	resetScoreNumbers();

	// input

	game.input.onDown.add(input, this);

	// audio

	sounds.die = game.add.audio('die');
	sounds.hit = game.add.audio('hit');
	sounds.point = game.add.audio('point');
	sounds.swoosh = game.add.audio('swoosh');
	sounds.wing = game.add.audio('wing');

	states.isPlaying = true;
	states.isDying = false;
	states.isGameOver = false;
}

function input(){
	if(states.isPlaying){
		birdVelocity = -config.flapPower;
		bird.animations.play('flap', 15, false);
		sounds.wing.play();
	} else if(states.isGameOver){
		resetGame();
	}
}

function resetGame(){
	// bird
	bird.x = config.width/2;
	bird.y = config.height/2;
	birdVelocity = 0;
	bird.angle = 0;

	// states
	states.isPlaying = true;
	states.isDying = false;
	states.isGameOver = false;

	// pipes
	initPipePositions();
	pipes[0].isScored = false;
	pipes[1].isScored = false;

	// score
	score = 0;
	resetScoreNumbers();

	gameOverImage.destroy();
	
}

function initPipePositions(){
	pipes[0].setX(config.width);
	pipes[0].setY(config.initPipeHeight);
	pipes[1].setX(config.width + config.width / 2);
	pipes[1].setY(config.initPipeHeight);
}

function update() {
	
	if(states.isPlaying) {
		
		// move base images
		var i = 0;
		for(i = 0; i < baseImages.length; i++){
			baseImages[i].x -= config.gameSpeed;
			if(baseImages[i].x <= -baseImages[i].width){
				baseImages[i].x = config.width;
			}
		}

		// pipes
		for(i = 0; i < pipes.length; i++){
			
			// move pipes

			pipes[i].setX(pipes[i].getX() - config.gameSpeed);
			if(pipes[i].getX() <= -26){
				pipes[i].setX(config.width + 26);
				pipes[i].setY(getRandomPipeY())
				pipes[i].isScored = false;
			}

			// check score

			if(!pipes[i].isScored){
				if(bird.x > pipes[i].getX()){
					increaseScore();
					pipes[i].isScored = true;
				}
			}

			// check collision

			if(bird.overlap(pipes[i].pipeBottom)){
				onPipeHit();
			}

			if(bird.overlap(pipes[i].pipeTop)){
				onPipeHit();
			}
		}

		// move bird
		birdVelocity += config.gravity;
		bird.y += birdVelocity;

		if(birdVelocity < 0){
			bird.animations.play('idle');
		}

		// check floor hit
		if(bird.y >= config.height - baseImages[0].height){
			bird.y = config.height - baseImages[0].height;
			sounds.hit.play();
			gameOver();
		}

	} else if(states.isDying) {

		birdVelocity += config.gravity;

		// drop the bird to the ground
		bird.y += birdVelocity;
		bird.x -= 1;
		
		// hit the ground and game over
		if(bird.y >= config.height - baseImages[0].height - 10){
			bird.y = config.height - baseImages[0].height - 10
			sounds.hit.play();
			gameOver();
		}

		// rotate dead bird while falling
		bird.angle -= config.deadRotationSpeed;

	} else if(states.isGameOver) {
		// do nothing on update
	}

}

function gameOver(){
	states.isPlaying = false;
	states.isDying = false;
	states.isGameOver = true;

	gameOverImage = game.add.image(config.width/2, config.height/2, 'gameover');
	gameOverImage.anchor.x = 0.5;
	gameOverImage.anchor.y = 0.5;
}

function onPipeHit(){
	if(states.isPlaying){
		states.isPlaying = false;
		states.isDying = true;
		states.isGameOver = false;

		sounds.hit.play();
		sounds.die.play();

		birdVelocity = 0;
	}
}

function getRandomPipeY(){
	return 50 + Math.floor(300*Math.random());
}

function increaseScore(){
	score++;
	sounds.point.play();
	updateScoreNumbers();
}

function updateScoreNumbers(){
	resetScoreNumbers();

	tens = Math.floor(score / 10);
	ones = score % 10;

	if(tens>0){
		scoreNumbers['tens'+tens].visible = true;
	}

	scoreNumbers['ones'+ones].visible = true;
}

function resetScoreNumbers(){
	var i = 0;
	
	// reset ones digits
	for(i=0; i<=9; i++){
		scoreNumbers['ones'+i].visible = false;
	}

	// reset tens digits
	for(i=1; i<=9; i++){
		scoreNumbers['tens'+i].visible = false;
	}
}