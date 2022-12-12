import produce from "immer";
import React, { useEffect, useRef, useState } from "react";
import { CellInterface } from "../interfaces";
import { getCellObjects, getFoodCell } from "../utils";
import Cell from "./Cell";
import { generateBoundedMaze } from "./mazes/boundedMaze";
import { generateHorizontalMaze } from "./mazes/horizontalMaze";

const GameBoard = () => {
  const gameBoard = useRef(getCellObjects());
  const [food, setFood] = useState<CellInterface | null>(null);
  const snakeDirection = useRef<"up" | "down" | "right" | "left">("right");
  const [snakeBody, setSnakeBody] = useState<number[][]>([[20, 20]]);
  const [renderFlag, setRenderFlag] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [play, setPlay] = useState(false);

  const resetBoard = () => {
    gameBoard.current = getCellObjects();
    setSnakeBody([[20, 20]]);
    setFood(getFoodCell(gameBoard.current));
    setPlay(false);
  };

  const getNextRowAndColByDirection = (row: number, col: number) => {
    switch (snakeDirection.current) {
      case "up":
        if (row === 0) row = 39;
        else row--;
        break;
      case "down":
        if (row === 39) row = 0;
        else row++;
        break;
      case "left":
        if (col === 0) col = 39;
        else col--;
        break;
      case "right":
        if (col === 39) col = 0;
        else col++;
        break;
    }
    return [row, col];
  };

  const handleSnakeTravel = () => {
    let row = snakeBody[0][0];
    let col = snakeBody[0][1];
    let interval = setInterval(() => {
      [row, col] = getNextRowAndColByDirection(row, col);
      setSnakeBody(
        produce((draft) => {
          let [tailRow, tailCol] = draft.pop() || []; // pop the tail to move forward
          try {
            gameBoard.current[tailRow][tailCol].isSnakeBodyPart = false;
          } catch (error) {}
          draft.unshift([row, col]); // move forward by updating head
        })
      );
      gameBoard.current[row][col].isSnakeBodyPart = true; // show that snake is moving forward
    }, 80);
    return interval;
  };

  const handleEatAndGameOver = (snakeRow: number, snakeCol: number) => {
    const snakeHead = gameBoard.current[snakeRow][snakeCol]; // see if snake head has touched the
    if (snakeHead.isWall) {
      resetBoard();
      return;
    }

    if (snakeRow === food?.row && snakeCol === food?.col) {
      gameBoard.current[food.row][food.col].isFood = false;
      setSnakeBody(
        produce((draft) => {
          let tail = draft[draft.length - 1];
          let newTail = [tail[0], tail[1]];
          draft.push(newTail);
        })
      );
      setFood(getFoodCell(gameBoard.current));
    }
  };

  useEffect(() => {
    if (!food && gameBoard) {
      setFood(getFoodCell(gameBoard.current));
    }
  }, [gameBoard]);

  useEffect(() => {
    if (!play) return;
    let interval = handleSnakeTravel();
    return () => {
      clearInterval(interval);
    };
  }, [snakeDirection, play]);

  useEffect(() => {
    handleEatAndGameOver(snakeBody[0][0], snakeBody[0][1]);
  }, [snakeBody]);

  const handleOnKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        if (snakeDirection.current === "down") break;
        snakeDirection.current = "up";
        break;
      case "ArrowDown":
        if (snakeDirection.current === "up") break;
        snakeDirection.current = "down";
        break;
      case "ArrowRight":
        if (snakeDirection.current === "left") break;
        snakeDirection.current = "right";
        break;
      case "ArrowLeft":
        if (play && snakeDirection.current === "right") break;
        snakeDirection.current = "left";
        break;
    }
    if (!play) {
      setPlay(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeyDown, false);
    return () => window.removeEventListener("keydown", handleOnKeyDown, false);
  }, [play]);

  const onMouseEnter = (rowIndex: number, colIndex: number) => {
    setRenderFlag(!renderFlag);
    let element = gameBoard.current[rowIndex][colIndex];
    if (!isMouseDown) return;
    if (element.isSnakeBodyPart) return;
    element.isWall = !element.isWall;
  };

  return (
    <>
      <button
        onClick={() => {
          setPlay(!play);
        }}
      >
        {play ? "Pause" : "Play"}
      </button>

      <button
        onClick={() => {
          generateBoundedMaze(gameBoard.current);
          setRenderFlag(!renderFlag);
        }}
      >
        Generate bounded maze
      </button>
      <button
        onClick={() => {
          generateHorizontalMaze(gameBoard.current);
          setRenderFlag(!renderFlag);
        }}
      >
        Generate horizontal maze
      </button>
      <p>Score: {snakeBody.length - 1}</p>
      <div className="grid grid-cols-gridmap overflow-auto w-full px-4 justify-start md:justify-center items-center my-3">
        {gameBoard.current.map((row, rowIndex) => {
          return (
            <React.Fragment key={rowIndex}>
              {row.map((cell, colIndex) => {
                return (
                  <Cell
                    key={colIndex}
                    id={`cell-${cell.row}-${cell.col}`}
                    {...cell}
                    onMouseDown={() => {
                      setIsMouseDown(true);
                    }}
                    onMouseEnter={() => {
                      onMouseEnter(rowIndex, colIndex);
                    }}
                    onMouseUp={() => {
                      setIsMouseDown(false);
                    }}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

export default GameBoard;
