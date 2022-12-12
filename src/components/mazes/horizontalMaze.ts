import { CellInterface } from "../../interfaces";

export const generateHorizontalMaze = (grid: CellInterface[][]) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let currentCell = grid[i][j];
      if (
        !currentCell.isSnakeBodyPart &&
        (i === 0 ||
          j === 0 ||
          i === grid.length - 1 ||
          j === grid[0].length - 1 ||
          ((i === 10 || i === 30) && j > 4 && j < 35))
      ) {
        currentCell.isWall = true;
      }
    }
  }
};
