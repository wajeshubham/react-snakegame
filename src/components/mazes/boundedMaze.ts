import { CellInterface } from "../../interfaces";

export const generateBoundedMaze = (grid: CellInterface[][]) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let currentCell = grid[i][j];
      if (
        !currentCell.isSnakeBodyPart &&
        (i === 0 || j === 0 || i === grid.length - 1 || j === grid.length - 1)
      ) {
        currentCell.isWall = true;
      }
    }
  }
};
