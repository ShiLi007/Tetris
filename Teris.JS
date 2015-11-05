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


//Locking pieces in place
//take all blocks in the current pattern of the piece, and store them in the game board
//check every row of the game board whether it is full, and if so, move all rows that are higher up down 

var lines = 0;
Piece.prototype.lock = function() {
    for (var ix = 0; ix < this.pattern.length; ix++) {
        for (var iy = 0; iy < this.pattern.length; iy++) {
            if (!this.pattern[ix][iy]) {
                continue;
            }

//If a piece locks in place, but any one of its blocks are above the top of the game board, then the player has failed, and the game is over
                if (this.y + iy < 0) {
                // Game ends!
                alert("You're done!");
                done = true;  //to stop the game 
                return;
            }
            board[this.y + iy][this.x + ix] = true;  //mark block slot as occupied
        }
    }
    
    
//eliminate full rows
       var nlines = 0;
    for (var y = 0; y < height; y++) {    // the outer loop is simply looping over all the rows on the board
        var line = true;                 //For each row, we define a Boolean variable,  line , which should only be set to true if every tile in a row is occupied
                                         // initializing it to true
        for (var x = 0; x < width; x++) {
            line = line && !board[y][x];   //a logical AND (only true when both the left and right expression are true) with the values of every tile
        }
        if (line) {     //If the row was indeed fully occupied, we need to move down all rows above it. The two nested for loops after the  if  do this for all but the topmost row 
            for (var y2 = y; y2 > 1; y2--) {   
                for (var x = 0; x < width; x++) {
                    board[y2][x] = board[y2-1][x];    //To "move" a row down, we loop over all the tiles of the row that is going to be overwritten, and set each tile's value to be the value of the corresponding tile in the row above
                }
            }
            for (var x = 0; x < width; x++) {    //If any tile is not occupied, it will be set to false, and the AND will become false, making  line  false.
                board[0][x] = false;
            }
            nlines++;   //increment a counter to keep track of the number of lines that were eliminated by this one piece locking in place
        }
    }
    
    
    //update the player's score
    if (nlines > 0) {
        lines += nlines;
        drawBoard();
        console.log(lines);
    }
};

//Spawning new pieces

var pieces = [
    [I, "cyan"],
    [J, "blue"],
    [L, "orange"],
    [O, "yellow"],
    [S, "green"],
    [T, "purple"],
    [Z, "red"]
];


//pick one of these pairs at random, construct a new object, and then return it.
function newPiece() {
    var p = pieces[parseInt(Math.random() * pieces.length, 10)];
    return new Piece(p[0], p[1]);
}


