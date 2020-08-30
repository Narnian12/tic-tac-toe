import React, { useState } from "react";
import Board from "./Board";

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winSquares: [a, b, c] };
    }
  }
  return null;
}

function Game(props) {
  const [gameState, setGameState] = useState({
    history: [
      {
        squares: Array(9).fill(null),
        col: null,
        row: null,
      },
    ],
    stepNumber: 0,
    xIsNext: true,
    reversed: false,
  });

  const handleClick = (i) => {
    // If user goes back and adds a new move while on a previous move, erase all future moves
    const history = !gameState.reversed
      ? gameState.history.slice(0, gameState.stepNumber + 1)
      : gameState.history
          .reverse()
          .slice(0, gameState.stepNumber + 1)
          .reverse();

    const current = !gameState.reversed
      ? history[history.length - 1]
      : history[0];

    const squares = current.squares.slice();
    // Optimize by not re-rendering if someone already won or if user clicked on a Square that is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Update the board depending on if the current user is X or O
    squares[i] = gameState.xIsNext ? "X" : "O";

    setGameState({
      ...gameState,
      // Add on to history
      history: !gameState.reversed
        ? history.concat([
            {
              squares: squares,
              col: i % 3,
              row: Math.floor(i / 3),
              player: squares[i],
            },
          ])
        : [
            {
              squares: squares,
              col: i % 3,
              row: Math.floor(i / 3),
              player: squares[i],
            },
          ].concat(history),
      stepNumber: history.length,
      xIsNext: !gameState.xIsNext,
    });
  };

  const jumpToHandler = (step) => {
    setGameState({
      ...gameState,
      stepNumber: !gameState.reversed
        ? step
        : gameState.history.length - 1 - step,
      xIsNext: !gameState.reversed
        ? step % 2 === 0
        : (gameState.history.length - 1 - step) % 2 === 0,
    });
  };

  // Reverses the history array
  const toggleHandler = () => {
    const reversedHistory = gameState.history
      .slice(0, gameState.history.length)
      .reverse();
    setGameState({
      ...gameState,
      history: reversedHistory,
      reversed: !gameState.reversed,
    });
  };

  const getDescription = (getStep, step, move) => {
    return getStep
      ? "Go to move #" +
          move +
          " where " +
          step.player +
          " moved to (" +
          step.col +
          ", " +
          step.row +
          ")"
      : "Go to game start";
  };

  const history = gameState.history;
  // Get the current based on where in history the user is
  const current = !gameState.reversed
    ? history[gameState.stepNumber]
    : history[gameState.history.length - 1 - gameState.stepNumber];
  const winner = calculateWinner(current.squares);

  // If the history array is reversed, count down instead of up
  let reversedMove = gameState.history.length;
  const moves = history.map((step, move) => {
    reversedMove--;
    const desc = !gameState.reversed
      ? getDescription(move, step, move)
      : getDescription(
          move !== gameState.history.length - 1,
          step,
          reversedMove
        );

    return (
      <li key={move}>
        {(!gameState.reversed && move === gameState.stepNumber) ||
        (gameState.reversed && reversedMove === gameState.stepNumber) ? (
          <button
            style={{ fontWeight: "bold" }}
            onClick={() => jumpToHandler(move)}
          >
            {desc}
          </button>
        ) : (
          <button onClick={() => jumpToHandler(move)}>{desc}</button>
        )}
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else {
    status =
      gameState.history.length === 10
        ? "Draw!"
        : "Next player: " + (gameState.xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
          winSquares={winner ? winner.winSquares : null}
        />
      </div>
      <div className="game-info">
        <div>
          {status}
          <button onClick={() => toggleHandler()} style={{ marginLeft: "8px" }}>
            Toggle
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game;
