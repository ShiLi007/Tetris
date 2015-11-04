//first, make the board.the board will ahve 200 tiles. We will use a 2D list with 20 lists total and each list contain 10 tiles.
//since all tiles are empaty, we set them to false. 

var board = [];
for (var row = 0; row < 20; row++) {
    board[row] = [];
    for (var tile = 0; tile < 10; tile++) {
        board[row][tile] = false;
    }
}
