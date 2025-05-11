/**
 * Check if the current move resulted in a win (6 in a row)
 * @param {Array} board - The game board
 * @param {Number} row - Row of the last move
 * @param {Number} col - Column of the last move
 * @param {Number} player - Player number (1 or 2)
 * @returns {Boolean} - True if the move resulted in a win
 */
export function checkWinCondition(board, row, col, player) {
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1]   // diagonal down-left
  ];
  
  for (const [dx, dy] of directions) {
    let count = 1;  // Start with 1 for the piece just placed
    
    // Check in the positive direction
    count += countConsecutive(board, row, col, dx, dy, player);
    
    // Check in the negative direction
    count += countConsecutive(board, row, col, -dx, -dy, player);
    
    // If 6 or more consecutive pieces found, it's a win
    if (count >= 6) {
      return true;
    }
  }
  
  return false;
}

/**
 * Count consecutive player pieces in a given direction
 * @param {Array} board - The game board
 * @param {Number} row - Starting row
 * @param {Number} col - Starting column
 * @param {Number} dx - Direction x
 * @param {Number} dy - Direction y
 * @param {Number} player - Player number
 * @returns {Number} - Count of consecutive matching pieces
 */
function countConsecutive(board, row, col, dx, dy, player) {
  let count = 0;
  let r = row + dx;
  let c = col + dy;
  
  // Keep checking until we find a non-match or hit the board boundary
  while (
    r >= 0 && r < 15 && 
    c >= 0 && c < 15 && 
    board[r][c] === player
  ) {
    count++;
    r += dx;
    c += dy;
  }
  
  return count;
}