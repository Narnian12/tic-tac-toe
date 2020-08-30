import React, { Component } from "react";

function Square(props) {
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

class Board extends Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        index={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winSquares={this.props.winSquares}
      />
    );
  }

  render() {
    let board = [];
    for (var i = 0; i < 3; i++) {
      let squares = [];
      for (var j = 0; j < 3; j++) {
        squares.push(this.renderSquare(j + i * 3));
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
}

export default Board;
