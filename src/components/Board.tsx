import React, { FC } from "react";

interface SquareProps {
  key: number;
  index: number;
  value: String;
  onClick: any;
  winSquares: number[]
}

function Square(props: SquareProps) {
  return props.winSquares && props.winSquares.includes(props.index) ? (
    <button className="win-square" onClick={props.onClick}>
      {props.value}
    </button>
  ) : (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

interface BoardProps {
  squares: Array<String>;
  onClick: any;
  winSquares: number[];
}

const Board: FC<BoardProps> = ({ squares, onClick, winSquares }) => {
  const renderSquare = (i: number) => {
    return (
      <Square
        key={i}
        index={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        winSquares={winSquares}
      />
    );
  }

  let board = [];
  for (var i = 0; i < 3; i++) {
    let squares = [];
    for (var j = 0; j < 3; j++) {
      squares.push(renderSquare(j + i * 3));
    }
    // An interesting side-effect is that every element within an array needs to have a "key" value
    board.push(
      <div className="board-row" key={i}>
        {squares}
      </div>
    );
  }

  return <div>{board}</div>;
}

export default Board;
