import produce from "immer";
import React, { useEffect, useRef, useState } from "react";
import { CellInterface } from "../interfaces";
import { getCellObjects, getFoodCell } from "../utils";
import Cell from "./Cell";
import { generateBoundedMaze } from "./mazes/boundedMaze";
import { generateHorizontalMaze } from "./mazes/horizontalMaze";
import {
  CubeTransparentIcon,
  StarIcon,
  PlayIcon,
  PauseIcon,
  CommandLineIcon,
  ArrowUpIcon,
  ArrowLeftIcon,
  ArrowDownIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

let interval: number;

const GameBoard = () => {
  const gameBoard = useRef(getCellObjects());
  const [food, setFood] = useState<CellInterface | null>(null);
  const snakeDirection = useRef<"up" | "down" | "right" | "left">("right");
  const [snakeBody, setSnakeBody] = useState<number[][]>([[20, 20]]);
  const [renderFlag, setRenderFlag] = useState(false);
  const [play, setPlay] = useState(false);

  const resetBoard = () => {
    gameBoard.current = getCellObjects();
    setSnakeBody((prev) => [[20, 20]]);
    setFood(getFoodCell(gameBoard.current));
    setPlay(false);
    clearInterval(interval);
  };

  const getNextRowAndColByDirection = (row: number, col: number) => {
    switch (snakeDirection.current) {
      case "up":
        if (row === 0) row = gameBoard.current.length - 1;
        else row--;
        break;
      case "down":
        if (row === gameBoard.current.length - 1) row = 0;
        else row++;
        break;
      case "left":
        if (col === 0) col = gameBoard.current[0].length;
        else col--;
        break;
      case "right":
        if (col === gameBoard.current[0].length) col = 0;
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
    if (snakeHead?.isWall) {
      resetBoard();
      alert("Game over! Please start over.");
      return;
    }

    let snakeBodyWithoutHead = snakeBody.slice(1);
    if (
      snakeBodyWithoutHead.length >= 3 &&
      snakeBodyWithoutHead.some((item) => {
        return item[0] === snakeRow && item[1] === snakeCol;
      })
    ) {
      resetBoard();
      alert("Game over! Please start over.");
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
    interval = handleSnakeTravel();
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

  return (
    <>
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
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
      <div className="flex justify-center items-center w-full flex-col gap-3 mb-10">
        <div className="flex justify-center items-center">
          <button
            onClick={() => {
              handleOnKeyDown({ key: "ArrowUp" } as KeyboardEvent);
            }}
            className="w-fit items-center md:ml-0 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
          >
            <ArrowUpIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={() => {
              handleOnKeyDown({ key: "ArrowLeft" } as KeyboardEvent);
            }}
            className="w-fit items-center md:ml-0 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              handleOnKeyDown({ key: "ArrowDown" } as KeyboardEvent);
            }}
            className="w-fit items-center md:ml-0 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
          >
            <ArrowDownIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              handleOnKeyDown({ key: "ArrowRight" } as KeyboardEvent);
            }}
            className="w-fit items-center md:ml-0 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
        <small className="mx-2 text-center">
          Use these keys if you are on a mobile phone, otherwise use your
          keyboard keys.
        </small>
      </div>
      <div className="relative md:absolute bottom-0 w-full">
        <a
          href="https://github.com/wajeshubham"
          target={"_blank"}
          className="underline text-blue-700 pr-4 inline-flex justify-end items-center w-full"
        >
          By - https://github.com/wajeshubham
        </a>
        <div className="w-full bg-gray-900">
          <div className="flex md:gap-0 flex-wrap gap-4 flex-1 py-4 max-w-7xl md:flex-row flex-col items-start md:items-center justify-center space-x-4 mx-auto">
            <button
              className="w-fit items-center ml-4 md:ml-0 disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
              onClick={() => {
                resetBoard();
                generateBoundedMaze(gameBoard.current);
                setRenderFlag(!renderFlag);
              }}
            >
              <CubeTransparentIcon className="w-4 h-4 mr-2" /> Generate bounded
              maze
            </button>
            <span
              className="md:block hidden h-6 w-px bg-gray-600"
              aria-hidden="true"
            />
            <button
              className="w-fit disabled:bg-gray-400 items-center disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
              onClick={() => {
                resetBoard();
                generateHorizontalMaze(gameBoard.current);
                setRenderFlag(!renderFlag);
              }}
            >
              <CubeTransparentIcon className="w-4 h-4 mr-2" /> Generate
              horizontal maze
            </button>
            <span
              className="md:block hidden h-6 w-px bg-gray-600"
              aria-hidden="true"
            />
            <button className="w-fit disabled:bg-gray-400 items-center disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md">
              <StarIcon className="w-4 h-4 mr-2" /> Score:{" "}
              {snakeBody.length - 1}
            </button>
            <span
              className="md:block hidden h-6 w-px bg-gray-600"
              aria-hidden="true"
            />

            <button
              onClick={() => {
                setPlay(!play);
              }}
              className="w-fit items-center disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
            >
              {play ? (
                <PauseIcon className="w-4 h-4 mr-2" />
              ) : (
                <PlayIcon className="w-4 h-4 mr-2" />
              )}{" "}
              {play ? "Pause" : "Play"}
            </button>

            <a
              href="https://github.com/wajeshubham/react-snakegame"
              target={"_blank"}
              className="w-fit items-center disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex bg-gray-600 text-[15px] text-white px-4 py-2 rounded-md"
            >
              <CommandLineIcon className="w-4 h-4 mr-2" />
              Source code
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameBoard;
