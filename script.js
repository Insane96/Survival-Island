var Game = {
	deltaTime: 0,
	oldTime: 0,

	Update: function(){
		Debug.Clear();
		
		newTime = Date.now();
		Game.deltaTime = (newTime - Game.oldTime) / 1000;
		Game.oldTime = newTime;
		
		for (var i = 0; i < Game.GameObjects.length; i++){
			Game.GameObjects[i].Update();
		}
	},
	
	GameObjects: [],
}

var Debug = {
	Write: function(string){
		document.getElementById("debug").innerHTML += string + "<br />";
	},

	Clear: function(){
		document.getElementById("debug").innerHTML = "";
	}
}

window.onload = function(){
	window.setInterval(function(){
		Game.Update();
	}, 1000 / 60);
}

window.addEventListener("keydown", function(e){
	for (var i = 0; i < Game.GameObjects.length; i++){
		Game.GameObjects[i].OnKeyDown(e);
	}
});

window.addEventListener("keypress", function(e){
	for (var i = 0; i < Game.GameObjects.length; i++){
		Game.GameObjects[i].OnKeyPress(e);
	}
});

window.addEventListener("keyup", function(e){
	for (var i = 0; i < Game.GameObjects.length; i++){
		Game.GameObjects[i].OnKeyUp(e);
	}
});

function Player(name){
	this.pos = new Vector2(0, 0);
	this.name = name;
	this.dom = document.createElement("div");
	this.dom.style.position = "absolute";
	this.dom.style.width = "30px";
	this.dom.style.height = "30px";
	this.dom.style.backgroundColor = "#0f0";
	
	this.direction = Vector2.Zero;
	this.movementSpeed = 20;
	
	this.Update = function(){
		Debug.Write("Directions: [" + this.direction.x + "," + this.direction.y + "]");
		
		var normDirection = Vector2.Normalize(this.direction);
		var speed = Vector2.Multiply(normDirection, this.movementSpeed * Game.deltaTime);
		this.pos = Vector2.Sum(this.pos, speed);
		
		this.dom.style.left = this.pos.x + "px";
		this.dom.style.top = this.pos.y + "px";
		Debug.Write("x: " + (Math.round(this.pos.x * 100) / 100) + " y: " + (Math.round(this.pos.y * 100) / 100));
	}
	
	this.OnKeyDown = function(event){
		console.log("down: " + event.keyCode);
		if (event.keyCode == KeyCodes.ArrowLeft && this.direction.x == 0){
			this.direction = Vector2.Sum(this.direction, Vector2.Left);
		}
		if (event.keyCode == KeyCodes.ArrowRight && this.direction.x == 0){
			this.direction = Vector2.Sum(this.direction, Vector2.Right);
		}
		if (event.keyCode == KeyCodes.ArrowUp && this.direction.y == 0){
			this.direction = Vector2.Sum(this.direction, Vector2.Up);
		}
		if (event.keyCode == KeyCodes.ArrowDown && this.direction.y == 0){
			this.direction = Vector2.Sum(this.direction, Vector2.Down);
		}
	}
	
	this.OnKeyPress = function(event){
		
	}
	
	this.OnKeyUp = function(event){
		console.log("up: " + event.keyCode);
		if (event.keyCode == KeyCodes.ArrowLeft && this.direction.x == -1){
			this.direction = Vector2.Subtract(this.direction, Vector2.Left);
		}
		if (event.keyCode == KeyCodes.ArrowRight && this.direction.x == 1){
			this.direction = Vector2.Subtract(this.direction, Vector2.Right);
		}
		if (event.keyCode == KeyCodes.ArrowUp && this.direction.y == -1){
			this.direction = Vector2.Subtract(this.direction, Vector2.Up);
		}
		if (event.keyCode == KeyCodes.ArrowDown && this.direction.y == 1){
			this.direction = Vector2.Subtract(this.direction, Vector2.Down);
		}
	}
	
	document.body.appendChild(this.dom);
	
	Game.GameObjects.push(this);
}