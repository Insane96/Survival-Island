function Vector2(x, y){
	this.x = x;
	this.y = y;
}

/*Returns the float length of the vector*/
Vector2.Length = function(vector2){
	if (arguments.length < 1)
		throw "Error: Vector2.Length requires 1 argument. Arguments provided: " + arguments.length;
	
	return Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
}

Vector2.Normalize = function(vector2){
	if (arguments.length < 1)
		throw "Error: Vector2.Normalize requires 1 argument. Arguments provided: " + arguments.length;
	
	var length = Vector2.Length(vector2);
	var vector = new Vector2(vector2.x, vector2.y);
	if (length != 0){
		vector.x /= length;
		vector.y /= length;
	}
	
	return vector;
}

/*Returns the float distance between two points*/
Vector2.Distance = function(vector2Start, vector2End){
	if (arguments.length < 2)
		throw "Error: Vector2.Distance requires 2 arguments. Arguments provided: " + arguments.length;
	
	var vectorDistance = new Vector2(vector2Start.x - vector2End.x, vector2Start.y - vector2End.y);
	return Vector2.Length(vectorDistance);
}

/*Returns the direction towards a point is ... pointing to another point*/
Vector2.Direction = function(vector2Start, vector2End){
	if (arguments.length < 2)
		throw "Error: Vector2.Direction requires 2 arguments. Arguments provided: " + arguments.length;
	
	var heading = new Vector2(vector2End.x - vector2Start.x, vector2End.y - vector2Start.y);
	var distance = Vector2.Distance(vector2Start, vector2End);
	
	var direction = new Vector2(heading.x / distance, heading.y / distance);
	
	return direction;
}

Vector2.Sum = function(vector2A, vector2B){
	if (vector2B.x == null)
		return new Vector2(vector2A.x + vector2B, vector2A.y + vector2B);
	return new Vector2(vector2A.x + vector2B.x, vector2A.y + vector2B.y);
}

Vector2.Subtract = function(vector2A, vector2B){
	if (vector2B.x == null)
		return new Vector2(vector2A.x - vector2B, vector2A.y - vector2B);
	return new Vector2(vector2A.x - vector2B.x, vector2A.y - vector2B.y);
}

Vector2.Multiply = function(vector2A, vector2B){
	if (vector2B.x == null)
		return new Vector2(vector2A.x * vector2B, vector2A.y * vector2B);
	return new Vector2(vector2A.x * vector2B.x, vector2A.y * vector2B.y);
}

Vector2.Divide = function(vector2A, vector2B){
	if (vector2B.x == null)
		return new Vector2(vector2A.x / vector2B, vector2A.y / vector2B);
	return new Vector2(vector2A.x / vector2B.x, vector2A.y / vector2B.y);
}

Vector2.Rotate = function(vector, degrees) {
	var radians = Math.DegrToRad(degrees);
	var sin = Math.sin(radians);
	var cos = Math.cos(radians);

	var tx = vector.x;
	var ty = vector.y;

	return new Vector2(cos * tx - sin * ty, sin * tx + cos * ty);
}

Vector2.Zero = new Vector2(0, 0);
Vector2.Up = new Vector2(0, -1);
Vector2.Down = new Vector2(0, 1);
Vector2.Right = new Vector2(1, 0);
Vector2.Left = new Vector2(-1, 0);

Math.DegrToRad = function(degr){
	return (Math.PI / 180) * degr;
}
Math.RadToDegr = function(rad){
	return (180 / Math.PI) * rad;
}

var KeyCodes = {
	Space: 32,
	ArrowUp: 38,
	ArrowDown: 40,
	ArrowLeft: 37,
	ArrowRight: 39
}

var Directions = {
	UP: 0,
	RIGHT: 1,
	DOWN: 2,
	LEFT: 3
}

var EnemyAI = {
	CHASING: 0,
	DAMAGING: 1,
	FLEEING: 2
}

var Debug = {
	Write: function(string){
		document.getElementById("debug").innerHTML += string + "<br />";
	},

	Clear: function(){
		document.getElementById("debug").innerHTML = "";
	}
}