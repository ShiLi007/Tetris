//first, make the board.the board will ahve 200 tiles. We will use a 2D list with 20 lists total and each list contain 10 tiles.
//since all tiles are empaty, we set them to false. 

var board = [];
for (var row = 0; row < 20; row++) {
    board[row] = [];
    for (var tile = 0; tile < 10; tile++) {
        board[row][tile] = false;
    }
}


//draw on an HTML canvas                                 //play around the size 
var canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");
var width = 10;
var height = 20;
var tilesz = 24;
canvas.width = width * tilesz;
canvas.height = height * tilesz;

//first we draw the square
//fillRect method on ctx for the filled square
//strokeStyle method on ctx for the hollow squares              //play aorund the color 
function drawSquare(x, y) {
    ctx.fillRect(x * tilesz, y * tilesz, tilesz, tilesz);
    ss = ctx.strokeStyle;
    ctx.strokeStyle = "#555";
    ctx.strokeRect(x * tilesz, y * tilesz, tilesz, tilesz);
    ctx.strokeStyle = "#888";
    ctx.strokeRect(x * tilesz + 3*tilesz/8, y * tilesz + 3*tilesz/8, tilesz/4, tilesz/4);
    ctx.strokeStyle = ss;                                      //the gray is alawys gray, try to play aournd see what happen 
}




//looping over all the tiles to draw the board                 //change the color see what happen 
function drawBoard() {               
    fs = ctx.fillStyle;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            ctx.fillStyle = board[y][x] ? 'red' : 'white';
            drawSquare(x, y, tilesz, tilesz);                    //call back ????
        }
    }
    ctx.fillStyle = fs;  
}





//creates prototype, so tetrominoes know how to draw themselves
function Piece(patterns, color) {
    this.pattern = patterns[0];
    this.patterns = patterns;
    this.patterni = 0;

    this.color = color;

    this.x = 0;      //the initial position of the piece at the left cornor above the board so it is invisible 
    this.y = -2;
}

/* Piece.prototype.draw = function() {
    fs = ctx.fillStyle;
    ctx.fillStyle = this.color;
    for (var ix = 0; ix < this.pattern.length; ix++) {
        for (var iy = 0; iy < this.pattern.length; iy++) {
            if (this.pattern[ix][iy]) {
                drawSquare(this.x + ix, this.y + iy);                 //call back ????
            }
        }
    }
    ctx.fillStyle = fs;
};

*/


//moving the tetrominoes
Piece.prototype.down = function() {
    this.undraw();
    this.y++;
    this.draw();
};

Piece.prototype.moveRight = function() {
    this.undraw();
    this.x++;
    this.draw();
};

Piece.prototype.moveLeft = function() {
    this.undraw();
    this.x--;
    this.draw();
};

Piece.prototype.rotate = function() {
    this.undraw();
    this.patterni = (this.patterni + 1) % this.patterns.length;
    this.pattern = this.patterns[this.patterni];
    this.draw();
};


//helper function that draw and undraw can call 
Piece.prototype._fill = function(color) {
    fs = ctx.fillStyle;
    ctx.fillStyle = color;
    var x = this.x;
    var y = this.y;
    for (var ix = 0; ix < this.pattern.length; ix++) {
        for (var iy = 0; iy < this.pattern.length; iy++) {
            if (this.pattern[ix][iy]) {
                drawSquare(x + ix, y + iy);
            }
        }
    }
    ctx.fillStyle = fs;                                         
};
//undraw the tetrominoes
Piece.prototype.undraw = function(ctx) {
    this._fill("black");
};

Piece.prototype.draw = function(ctx) {
    this._fill(this.color);
};


//added collisions 
Piece.prototype.rotate = function() {
    var nextpat = this.patterns[(this.patterni + 1) % this.patterns.length];
    if (!this._collides(0, 0, nextpat)) {
        this.undraw();
        this.patterni = (this.patterni + 1) % this.patterns.length;
        this.pattern = this.patterns[this.patterni];
        this.draw();
    }
};
Piece.prototype.down = function() {
    if (this._collides(0, 1, this.pattern)) {
        // Piece hits something and should be locked in place
        // A new piece should be spawned
    } else {
        this.undraw();
        this.y++;
        this.draw();
    }
};

Piece.prototype.moveRight = function() {
    if (!this._collides(1, 0, this.pattern)) {
        this.undraw();
        this.x++;
        this.draw();
    }
};

Piece.prototype.moveLeft = function() {
    if (!this._collides(-1, 0, this.pattern)) {
        this.undraw();
        this.x--;
        this.draw();
    }
};



Piece.prototype._collides = function(dx, dy, pat) {
    for (var ix = 0; ix < pat.length; ix++) {
        for (var iy = 0; iy < pat.length; iy++) {
            if (!pat[ix][iy]) {
                continue;
            }

            var x = this.x + ix + dx;
            var y = this.y + iy + dy;
            if (y >= height || x < 0 || x >= width) {
                return true;
            }
            if (y < 0) {
                // Ignore negative space rows
                continue;
            }
            if (board[y][x]) {
                return true;
            }
        }
    }

    return false;
};

//key press event listener 
var dropStart = Date.now();      //keep track of the last time the user made a move
document.body.addEventListener("keypress", function (e) {
    if (e.keyCode == 38) { // Player pressed up
        piece.rotate();
        dropStart = Date.now();
    }
    if (e.keyCode == 40) { // Player holding down
        piece.down();
    }
    if (e.keyCode == 37) { // Player holding left
        piece.moveLeft();
        dropStart = Date.now();
    }
    if (e.keyCode == 39) { // Player holding right
        piece.moveRight();
        dropStart = Date.now();
    }
}, false);

//make the falling piece drop down once every so often
var done = false;
function main() {
    var now = Date.now();
    var delta = now - dropStart;

    if (delta > 1000) {
        piece.down();
        dropStart = now;
    }

    if (!done) {
        requestAnimationFrame(main);
    }
}
main();

