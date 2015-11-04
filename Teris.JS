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
            drawSquare(x, y, tilesz, tilesz);
        }
    }
    ctx.fillStyle = fs;  
}

