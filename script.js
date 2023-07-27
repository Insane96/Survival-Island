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

window.onload = function(){
	window.setInterval(function(){
		Game.Update();
	}, 1000 / 60);
	
	Game.island = new Island(100, 100, 750, 450);
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

/* window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
}); */

function GameObject(x, y, width, height){
	if (arguments.length < 4)
		throw "GameObject contstructor requires 4 arguments. Arguments: " + arguments.length;
	
	this.pos = new Vector2(x, y);
	this.size = new Vector2(width, height);
	this.tags = ["gameObject"];
	
	Object.defineProperty(this, "centerPosition", {
		get: function(){
			return new Vector2(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
		}
	});
	
	Game.GameObjects.push(this);
}

GameObject.IsColliding = function(collider){
	if (arguments.length != 1)
		throw "GameObject.IsColliding() requires 1 argument. Arguments: " + arguments.length;
	
	if (collider.pos === undefined)
		throw "GameObject.IsColliding() typeof arguments must be GameObject";
	
	var gameObjects = [];
	
	for (var i = 0; i < Game.GameObjects.length; i++){
		var colliding = Game.GameObjects[i];
		if (colliding.hitbox.x1 + colliding.pos.x < collider.hitbox.x2 + collider.pos.x && 
		colliding.hitbox.x2 + colliding.pos.x > collider.hitbox.x1 + collider.pos.x && 
		colliding.hitbox.y1 + colliding.pos.y < collider.hitbox.y2 + collider.pos.y && 
		colliding.hitbox.y2 + colliding.pos.y > collider.hitbox.y1 + collider.pos.y){
			gameObjects.push(colliding);
		}
	}
		
	return gameObjects;
}

GameObject.HasTag = function(gameObject, tag){
	if (arguments.length < 2)
		throw "GameObject.HasTag() requires 2 arguments. Arguments: " + arguments.length;
	
	if (gameObject.tags === undefined)
		throw "GameObject.HasTag() typeof argument gameObject must be a GameObject";
	
	for (var i = 0; i < gameObject.tags.length; i++){
		if (gameObject.tags[i] === tag){
			return true;
		}
	}
	return false;
}

function Sprite(spritePath, className, x, y, width, height, hitbox){
	if (arguments.length < 6)
		throw "Sprite constructor requires at least 6 arguments. Arguments: " + arguments.length;
	
	if (hitbox === undefined)
		hitbox = new Hitbox(0, 0, width, height);
	this.hitbox = hitbox;
	
	GameObject.call(this, x, y, width, height);
	
	this.collisionPos = new Vector2(2, 2);
	this.collisionSize = new Vector2(2, 2);
	
	this.dom = document.createElement("div");
	this.dom.className = className;
	
	this.dom.style.position = "absolute";
	this.dom.style.width = this.size.x;
	this.dom.style.height = this.size.y;
	this.dom.style.left = this.pos.x + "px";
	this.dom.style.top = this.pos.y + "px";
	this.dom.style.backgroundImage = "url("+spritePath+")";
	
	document.body.appendChild(this.dom);
}

function Hitbox(x1, y1, x2, y2){
	if (arguments.length == 0){
		this.x1 = 0;
		this.x2 = 0;
		this.y1 = 0;
		this.y2 = 0;
	}
	else if (arguments.length < 4)
		throw "Hitbox constructor must have 4 arguments. Arguments: " + arguments.length;
	else {
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
	}
}

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

function Player(x, y, width, height, keymap){
	this.hitbox = new Hitbox(4, 4, width - 4, height - 4);
	Sprite.call(this, "assets/textures/player.png", "player", x, y, width, height, this.hitbox);

	if (keymap === undefined)
		keymap = new KeyMap(KeyCodes.ArrowUp, KeyCodes.ArrowDown, KeyCodes.ArrowLeft, KeyCodes.ArrowRight, KeyCodes.Space);
	this.keymap = keymap;
	this.tags.push("player");
	
	this.direction = Vector2.Zero;
	this.movementSpeed = 50;
	
	this.Update = function(){
		Debug.Write("Direction: [" + this.direction.x + "," + this.direction.y + "]");
		
		var normDirection = Vector2.Normalize(this.direction);
		var speed = Vector2.Multiply(normDirection, this.movementSpeed * Game.deltaTime);
		var oldPos = this.pos;
		this.pos = Vector2.Sum(this.pos, speed);
		
		if (this.pos.x < Game.island.pos.x)
			this.pos.x = Game.island.pos.x;
		if (this.pos.y < Game.island.pos.y)
			this.pos.y = Game.island.pos.y
		if (this.pos.x + this.size.x > Game.island.pos.x + Game.island.size.x)
			this.pos.x = Game.island.pos.x + Game.island.size.x - this.size.x;
		if (this.pos.y + this.size.y > Game.island.pos.y + Game.island.size.y)
			this.pos.y = Game.island.pos.y + Game.island.size.y - this.size.y;
		
		var colliding = GameObject.IsColliding(this);
		for (var i = 0; i < colliding.length; i++){
			if (GameObject.HasTag(colliding[i], "rock")){
				this.pos = oldPos
			}
		}
		
		this.dom.style.left = this.pos.x + "px";
		this.dom.style.top = this.pos.y + "px";
		Debug.Write("x: " + (Math.round(this.pos.x * 100) / 100) + " y: " + (Math.round(this.pos.y * 100) / 100));
	}
	
	this.OnKeyDown = function(event){
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
}

function Island(x, y, width, height){
	var hitbox = new Hitbox();
	Sprite.call(this, "assets/textures/island.png", "island", x, y, width, height, hitbox);
	this.dom.style.zIndex = -1;
	this.tags.push("island");
	
	this.rocks = [];
	
	Game.player = new Player(this.pos.x, this.pos.y, 33, 45);
	for (var i = 0; i < 10; i++){
		var rockSize = new Vector2(Math.random() * 15 + 22.5, Math.random() * 15 + 22.5)
		var rock = new Rock(Math.random() * (this.size.x - rockSize.x) + this.pos.x, Math.random() * (this.size.y - rockSize.y) + this.pos.y, rockSize.x, rockSize.y);
		this.rocks.push(rock);
	}
}

function Rock(x, y, width, height){
	Sprite.call(this, "assets/textures/rock.png", "rock", x, y, width, height);
	this.tags.push("rock");
}

function Enemy(spritePath, x, y, width, height){
	Sprite.call(this, spritePath, "enemy", x, y, width, height);
	this.movementSpeed = 25;
	this.AI = EnemyAI.CHASING;
	var direction;
	var collidedWith;
	this.tags.push("enemy");
}

function Slime(x, y){
	Enemy.call(this, "assets/textures/slime.png", x, y, 28.5, 13.5);
	this.tags.push("slime");
	this.movementSpeed = 15;
	
	this.Update = function(){
		if (this.AI == EnemyAI.CHASING){
			direction = Vector2.Direction(this.centerPosition, Game.player.centerPosition);
			var directionSpeed = Vector2.Multiply(direction, this.movementSpeed * Game.deltaTime);
			var oldPos = this.pos;
			this.pos = Vector2.Sum(this.pos, directionSpeed);
			
			var colliding = GameObject.IsColliding(this);
			for (var i = 0; i < colliding.length; i++){
				if (GameObject.HasTag(colliding[i], "rock")){
					this.pos = oldPos;
				}
				else if (GameObject.HasTag(colliding[i], "player")){
					this.AI = EnemyAI.DAMAGING;
				}
			}
		}
		else if (this.AI == EnemyAI.DAMAGING){
			//Damage PLayer
			if (Vector2.Distance(this.centerPosition, Game.player.centerPosition) > this.size.x)
				this.AI = EnemyAI.CHASING;
		}
		this.dom.style.left = this.pos.x + "px";
		this.dom.style.top = this.pos.y + "px";
		Debug.Write("Enemy<br/>x: " + (Math.round(this.pos.x * 100) / 100) + " y: " + (Math.round(this.pos.y * 100) / 100));
	}
}

var enemy;
function SpawnEnemy(){
	enemy = new Slime(Math.random() * Game.island.size.x / 2 + Game.island.pos.x, Math.random() * Game.island.size.y / 2 + Game.island.pos.y);
}