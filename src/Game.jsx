import React from "react";

export const Game = () => {
  const BoardSize = 10;
  let row = [];
  const board = [];

  //   let column = [];
  for (let j = 0; j < BoardSize; j++) {
    row.push(j);
  }
  for (let i = 0; i < BoardSize; i++) {
    console.log(row);
    board.push(row);
    console.log(board);
  }
  console.log(board);
  return (
    <div>
      {board.map((row, indR) => {
        return (
          <div key={indR} className="row">
            {row.map((cell, indC) => {
              return <div key={indC} className="cell"></div>;
            })}
          </div>
        );
      })}
    </div>
  );
};
