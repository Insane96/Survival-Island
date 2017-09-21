var Game = {
	deltaTime: 0,
	oldTime: 0,

	Update: function(){
		Debug.Clear();
		
		newTime = Date.now();
		Game.deltaTime = (newTime - Game.oldTime) / 1000;
		Game.oldTime = newTime;
		
		for (var i = 0; i < Game.GameObjects.length; i++){
			if (typeof Game.GameObjects[i].Update === "function")
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
	
	
	island = new Island(100, 100, 750, 450);
}

window.addEventListener("keydown", function(e){
	for (var i = 0; i < Game.GameObjects.length; i++){
		if (typeof Game.GameObjects[i].OnKeyDown === "function")
			Game.GameObjects[i].OnKeyDown(e);
	}
});

window.addEventListener("keypress", function(e){
	for (var i = 0; i < Game.GameObjects.length; i++){
		if (typeof Game.GameObjects[i].OnKeyPress === "function")
			Game.GameObjects[i].OnKeyPress(e);
	}
});

window.addEventListener("keyup", function(e){
	for (var i = 0; i < Game.GameObjects.length; i++){
		if (typeof Game.GameObjects[i].OnKeyUp === "function")
			Game.GameObjects[i].OnKeyUp(e);
	}
});

function KeyMap(up, down, left, right, action){
	if (typeof up == "string")
		up = up.toUpperCase().charCodeAt(0);
	if (typeof down == "string")
		down = down.toUpperCase().charCodeAt(0);
	if (typeof left == "string")
		left = left.toUpperCase().charCodeAt(0);
	if (typeof right == "string")
		right = right.toUpperCase().charCodeAt(0);
	if (typeof action == "string")
		action = action.toUpperCase().charCodeAt(0);
	
	this.up = up;
	this.down = down;
	this.left = left;
	this.right = right;
	this.action = action;
}

var player;

function Player(pos, name, keymap){
	if (pos.x == null)
		pos = Vector2.Zero;
	this.pos = pos;
	this.size = new Vector2(30, 30)
	this.name = name;
	if (keymap === undefined)
		keymap = new KeyMap(KeyCodes.ArrowUp, KeyCodes.ArrowDown, KeyCodes.ArrowLeft, KeyCodes.ArrowRight, KeyCodes.Space);
	
	this.keymap = keymap;
	
	this.dom = document.createElement("div");
	this.dom.className = "player";
	
	this.dom.style.position = "absolute";
	this.dom.style.width = this.size.x;
	this.dom.style.height = this.size.y;
	this.dom.style.left = this.pos.x + "px";
	this.dom.style.top = this.pos.y + "px";
	
	this.direction = Vector2.Zero;
	this.movementSpeed = 50;
	
	this.Update = function(){
		Debug.Write("Direction: [" + this.direction.x + "," + this.direction.y + "]");
		
		var normDirection = Vector2.Normalize(this.direction);
		var speed = Vector2.Multiply(normDirection, this.movementSpeed * Game.deltaTime);
		var oldPos = this.pos;
		this.pos = Vector2.Sum(this.pos, speed);
		
		if (this.pos.x < island.pos.x)
			this.pos.x = island.pos.x;
		if (this.pos.y < island.pos.y)
			this.pos.y = island.pos.y
		if (this.pos.x + this.size.x > island.pos.x + island.size.x)
			this.pos.x = island.pos.x + island.size.x - this.size.x;
		if (this.pos.y + this.size.y > island.pos.y + island.size.y)
			this.pos.y = island.pos.y + island.size.y - this.size.y;
		
		for (var i = 0; i < island.rocks.length; i++){
			var rock = island.rocks[i];
			if (this.pos.x < rock.pos.x + rock.size.x && 
				this.pos.x + this.size.x > rock.pos.x && 
				this.pos.y < rock.pos.y + rock.size.y && 
				this.pos.y + this.size.y > rock.pos.y)
				this.pos = oldPos;
		}
		
		this.dom.style.left = this.pos.x + "px";
		this.dom.style.top = this.pos.y + "px";
		Debug.Write("x: " + (Math.round(this.pos.x * 100) / 100) + " y: " + (Math.round(this.pos.y * 100) / 100));
	}
	
	this.OnKeyDown = function(event){
		console.log("down: " + event.keyCode);
		if (this.direction.x == 0){
			if (event.keyCode == this.keymap.left)
				this.direction = Vector2.Sum(this.direction, Vector2.Left);
			
			if (event.keyCode == this.keymap.right)
				this.direction = Vector2.Sum(this.direction, Vector2.Right);
		}
		
		if (this.direction.y == 0){
			if (event.keyCode == this.keymap.up)
				this.direction = Vector2.Sum(this.direction, Vector2.Up);
			
			if (event.keyCode == this.keymap.down)
				this.direction = Vector2.Sum(this.direction, Vector2.Down);
		}
		
	}
	
	this.OnKeyPress = function(event){
		
	}
	
	this.OnKeyUp = function(event){
		if (event.keyCode == this.keymap.left && this.direction.x == -1){
			this.direction = Vector2.Subtract(this.direction, Vector2.Left);
		}
		if (event.keyCode == this.keymap.right && this.direction.x == 1){
			this.direction = Vector2.Subtract(this.direction, Vector2.Right);
		}
		if (event.keyCode == this.keymap.up && this.direction.y == -1){
			this.direction = Vector2.Subtract(this.direction, Vector2.Up);
		}
		if (event.keyCode == this.keymap.down && this.direction.y == 1){
			this.direction = Vector2.Subtract(this.direction, Vector2.Down);
		}
	}
	
	document.body.appendChild(this.dom);
	
	Game.GameObjects.push(this);
}

var island;

function Island(x, y, width, height){
	this.pos = new Vector2(x, y);
	this.size = new Vector2(width, height);
	
	this.dom = document.createElement("div");
	this.dom.id = "island";
	
	this.dom.style.position = "absolute";
	this.dom.style.width = this.size.x;
	this.dom.style.height = this.size.y;
	this.dom.style.left = this.pos.x + "px";
	this.dom.style.top = this.pos.y + "px";
	this.dom.style.zIndex = -1;
	
	this.rocks = [];
	
	player = new Player(this.pos, "name");
	for (var i = 0; i < 10; i++){
		var rockSize = new Vector2(Math.random() * 10 + 15, Math.random() * 10 + 15)
		var rock = new Rock(Math.random() * (this.size.x - rockSize.x) + this.pos.x, Math.random() * (this.size.y - rockSize.y) + this.pos.y, rockSize.x, rockSize.y);
		this.rocks.push(rock);
	}
	
	document.body.appendChild(this.dom);
}

function Rock(x, y, width, height){
	this.pos = new Vector2(x, y);
	this.size= new Vector2(width, height);
	
	this.dom = document.createElement("div");
	this.dom.className = "rock";
	
	this.dom.style.position = "absolute";
	this.dom.style.width = this.size.x;
	this.dom.style.height = this.size.y;
	this.dom.style.left = this.pos.x + "px";
	this.dom.style.top = this.pos.y + "px";
	
	Game.GameObjects.push(this);
	
	document.body.appendChild(this.dom);
}