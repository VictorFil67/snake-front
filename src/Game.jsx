import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { GameOverModal } from "./GameOverModal";
import axios from "axios";

export const Game = () => {
  const BoardSize = 10;
  let row = [];
  const board = [];
  const speedInterval = 100;
  const [speed, setSpeed] = useState(500);
  const [snake, setSnake] = useState([[1, 1]]);
  const [food, setFood] = useState([0, 0]);
  const [gameOver, setGameOver] = useState(false);
  const [point, setPoint] = useState(0);
  const [prevPoint, setPrevPoint] = useState(0);
  const [feedCount, setFeedCount] = useState(0);
  const [direction, setDirection] = useState("ArrowDown");
  const [name, setName] = useState("");
  const [highScores, setHighScores] = useState([]);

  const directions = useMemo(
    () => ["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Space"],
    []
  );

  for (let j = 0; j < BoardSize; j++) {
    row.push(j);
  }
  for (let i = 0; i < BoardSize; i++) {
    board.push(row);
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
      //   console.log(e.key);
      //   console.log(e.code);
      const index = directions.indexOf(e.code);
      //   console.log(directions.indexOf(e.code));
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
      const newSnake = snake;

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

      if (newSnake.some((el) => el[0] === head[0] && el[1] === head[1])) {
        setGameOver(true);
        clearTimeout(timerId);
        return;
      }

      newSnake.push(head);
      let notFeed = 1;
      setPrevPoint(point);
      if (head[0] === food[0] && head[1] === food[1]) {
        notFeed = 0;
        addFood();
        setFeedCount(feedCount + 1);
        // console.log(feedCount);
        if (feedCount === 0 || feedCount % 3 === 0) {
          setPoint(point + 1);
        } else if (feedCount === 1 || feedCount % 3 === 1) {
          setPoint(point + 5);
        } else if (feedCount === 2 || feedCount % 3 === 2) {
          setPoint(point + 10);
        }
      }
      if (Math.floor(prevPoint / 50) < Math.floor(point / 50)) {
        setSpeed(speed - speedInterval);
      }
      console.log(Math.floor(prevPoint / 100), Math.floor(point / 50));
      setSnake(newSnake.slice(notFeed));
    }, speed);
    return timerId;
  }, [
    snake,
    direction,
    directions,
    food,
    addFood,
    point,
    feedCount,
    speed,
    prevPoint,
  ]);

  useEffect(() => {
    if (direction !== directions[4] && !gameOver) {
      const timerId = gameСycle();
      return () => clearInterval(timerId);
    }
  }, [gameСycle, direction, directions, gameOver]);

  useEffect(() => {
    const fetchScores = async () => {
      const result = await axios.get("http://localhost:5000/api/records");
      setHighScores(result.data);
    };
    fetchScores();
  }, []);

  return (
    <div className="wrap">
      <div>
        <input
          className="nameField"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <h1>Score: {point}</h1>
        <h2>Speed: {1000 / speed}sell/s</h2>
        <h2>Records:</h2>
        <ul className="list">
          {highScores.map((score, idx) => (
            <li key={score.id} className="item">
              {idx + 1} {score.name}: {score.points}
            </li>
          ))}
        </ul>
      </div>
      <div>
        {board.map((row, indR) => {
          return (
            <div key={indR} className="row">
              {row.map((_, indC) => {
                let type =
                  snake.some((el) => el[0] === indR && el[1] === indC) &&
                  "snake";
                if (type !== "snake") {
                  type = food[0] === indR && food[1] === indC && "food";
                }
                return <div key={indC} className={`cell ${type}`}></div>;
              })}
            </div>
          );
        })}
      </div>
      {gameOver &&
        createPortal(
          <GameOverModal setGameOver={setGameOver} />,
          document.body
        )}
    </div>
  );
};
