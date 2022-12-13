import React, { HTMLAttributes } from "react";
import { CellInterface } from "../interfaces";
import { classNames } from "../utils";

const Cell: React.FC<CellInterface & HTMLAttributes<HTMLDivElement>> = ({
  isWall,
  cellNumber,
  col,
  row,
  isFood,
  isSnakeBodyPart,
  ...props
}) => {
  return (
    <div
      {...props}
      className={classNames(
        isWall ? "bg-gray-900 wall-animate" : "",
        isFood ? "bg-red-500 rounded-full" : "",
        isSnakeBodyPart ? "bg-green-600" : "",
        "cell lg:w-4 w-3.5 lg:h-4 h-3.5 inline-flex justify-center items-center aspect-square border-[0.1px] border-indigo-300 border-opacity-70"
      )}
    ></div>
  );
};

export default Cell;
