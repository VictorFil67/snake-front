import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Cell } from "./Cell";

export const Game = () => {
  const BoardSize = 10;
  let row = [];
  const board = [];
  const speed = 500;
  const [snake, setSnake] = useState([[1, 1]]);
  //   const [direction, setDirection] = useState("LEFT");
  const [food, setFood] = useState(
    [0, 0]
    // [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]
  );
  const directions = useMemo(
    () => ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Space"],
    []
  );
  const [direction, setDirection] = useState("ArrowDown");

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

  const handleKeyDown = useCallback(
    (e) => {
      console.log(e.key);
      console.log(e.code);
      const index = directions.indexOf(e.code);
      console.log(directions.indexOf(e.code));
      if (index > -1) {
        setDirection(directions[index]);
      }
    },
    [directions]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const addFood = useCallback(() => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * BoardSize),
        Math.floor(Math.random() * BoardSize),
      ];
      setFood(newFood);
      // eslint-disable-next-line no-loop-func
    } while (snake.some((el) => el[0] === newFood[0] && el[1] === newFood[1]));
  }, [snake]);

  const gameСycle = useCallback(() => {
    const timerId = setTimeout(() => {
      //   console.log("first");
      const newSnake = snake;
      //   console.log(snake);
      let moveSnake = [];
      switch (direction) {
        case directions[0]:
          moveSnake = [1, 0];
          break;
        case directions[1]:
          moveSnake = [-1, 0];
          break;
        case directions[2]:
          moveSnake = [0, 1];
          break;
        case directions[3]:
          moveSnake = [0, -1];
          break;
        case directions[4]:
          moveSnake = [0, 0];
          break;

        default:
          moveSnake = [1, 0];
          break;
      }
      const head = [
        checkSnakePosition(newSnake[snake.length - 1][0] + moveSnake[0]),
        checkSnakePosition(newSnake[snake.length - 1][1] + moveSnake[1]),
      ];
      newSnake.push(head);
      let notFeed = 1;
      if (head[0] === food[0] && head[1] === food[1]) {
        notFeed = 0;
        addFood();
      }
      setSnake(newSnake.slice(notFeed));
    }, speed);
    return timerId;
  }, [snake, direction, directions, food, addFood]);

  useEffect(() => {
    if (direction !== directions[4]) {
      const timerId = gameСycle();
      return () => clearInterval(timerId);
    }
  }, [gameСycle, direction, directions]);

  return (
    <div>
      {board.map((row, indR) => {
        return (
          <div key={indR} className="row">
            {row.map((_, indC) => {
              let type =
                snake.some((el) => el[0] === indR && el[1] === indC) && "snake";
              if (type !== "snake") {
                type = food[0] === indR && food[1] === indC && "food";
              }
              return <div key={indC} className={`cell ${type}`}></div>;
            })}
          </div>
        );
      })}
    </div>
  );
};
