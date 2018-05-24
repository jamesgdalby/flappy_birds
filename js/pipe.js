function Pipe(gameInstance, color){
	this.game = gameInstance;
	this._x = 0;
	this._y = 0;
	this.pipeTop = null;
	this.pipeBottom = null;
	this.color = color;
	this.pipeOffset = 210;
	this.scored = false;
};

Pipe.prototype = {
	
	init:function(){

		var pipeColor;
		if(this.color = 'green'){
			pipeColor = 'pipe-green';
		} else {
			pipeColor = 'pipe-red';
		}

		// pipe bottom
		this.pipeBottom = this.game.add.sprite(this._x, this.pipeOffset, pipeColor);
		this.pipeBottom.anchor.x = 0.5;
		this.pipeBottom.anchor.y = 0.5;
		
		// pipe top
		this.pipeTop = this.game.add.sprite(this._x, this.pipeOffset, pipeColor);
		this.pipeTop.anchor.x = 0.5;
		this.pipeTop.anchor.y = 0.5;
		this.pipeTop.angle = 180;
		
	}, 
	getX: function(){return this._x;},
	setX: function (value){  
			this._x = value;
			this.pipeBottom.x = value;
			this.pipeTop.x = value;
	}, 
	getY: function(){return this._y;}, 
	setY: function(value){
			this._y = value;
			this.pipeBottom.y = value + this.pipeOffset;
			this.pipeTop.y = value - this.pipeOffset;;
	}, 
	width: function(){
		return this.pipeBottom.width;
	}
}