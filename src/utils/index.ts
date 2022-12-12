import { CellInterface } from "../interfaces";

export const classNames = (...className: string[]) => {
  return className.filter(Boolean).join(" ");
};

export const createCell = (data: CellInterface) => {
  return { ...data };
};

export const singleCell: CellInterface = {
  cellNumber: 0,
  col: 0,
  row: 0,
  isWall: false,
  isSnakeBodyPart: false,
  isFood: false,
};

export const getCellObjects = (
  startRow: number = 20,
  startCol: number = 20
): CellInterface[][] => {
  let gridCells: CellInterface[][] = [];
  let cellNumber = 0;
  for (let rowInd = 0; rowInd < 40; rowInd++) {
    let currentRow: CellInterface[] = [];
    for (let colInd = 0; colInd < 40; colInd++) {
      currentRow.push({
        ...singleCell,
        row: rowInd,
        col: colInd,
        cellNumber,
        isSnakeBodyPart: rowInd === startRow && colInd === startCol,
      });
      cellNumber++;
    }
    gridCells.push(currentRow);
  }

  return gridCells;
};

export const getFoodCell = (grid: CellInterface[][]): CellInterface => {
  let rowIndex = Math.ceil(Math.random() * 38);
  let colIndex = Math.ceil(Math.random() * 38);
  let cellToBeRender = grid[rowIndex][colIndex];
  if (cellToBeRender.isSnakeBodyPart || cellToBeRender.isWall) {
    return getFoodCell(grid);
  }
  cellToBeRender.isFood = true;
  return cellToBeRender;
};

export const getSnakeCell = (
  grid: CellInterface[][],
  row: number,
  col: number
): CellInterface => {
  let snakeCell = grid[row][col];
  snakeCell.isSnakeBodyPart = true;
  return snakeCell;
};
