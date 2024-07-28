import React, { useEffect, useState } from "react";
import { Cell } from "./Cell";

export const Game = () => {
  const BoardSize = 10;
  let row = [];
  const board = [];
  const speed = 500;
  const [snake, setSnake] = useState([[1, 1]]);
  //   const [direction, setDirection] = useState("LEFT");
  const [food, setFood] = useState(
    [0, 0]
    // x: Math.floor(Math.random() * 20),
    // y: Math.floor(Math.random() * 20),
  );

  for (let j = 0; j < BoardSize; j++) {
    row.push(j);
  }
  for (let i = 0; i < BoardSize; i++) {
    // console.log(row);
    board.push(row);
    // console.log(board);
  }

  function checkSnakePosition(position) {
    if (position >= BoardSize) {
      return 0;
    } else if (position < 0) {
      return BoardSize - 1;
    } else {
      return position;
    }
  }
  useEffect(() => {
    const timerId = gameСycle();
    return () => clearInterval(timerId);
  }, [snake]);

  function gameСycle() {
    const timerId = setTimeout(() => {
      console.log("first");
      const newSnake = snake;
      console.log(snake);
      let moveSnake = [];

      moveSnake = [1, 0];
      const head = [
        checkSnakePosition(newSnake[snake.length - 1][0] + moveSnake[0]),
        checkSnakePosition(newSnake[snake.length - 1][1] + moveSnake[1]),
      ];
      console.log({ head });
      newSnake.push(head);
      //   console.log(newSnake);
      setSnake(newSnake.slice(1));
    }, speed);
    return timerId;
  }

  return (
    <div>
      {board.map((row, indR) => {
        return (
          <div key={indR} className="row">
            {row.map((cell, indC) => {
              let type =
                snake.some((el) => el[0] === indR && el[1] === indC) && "snake";
              if (type !== "snake") {
                type = food[0] === indR && food[1] === indC && "food";
              }
              return <Cell key={indC} type={type}></Cell>;
            })}
          </div>
        );
      })}
    </div>
  );
};
