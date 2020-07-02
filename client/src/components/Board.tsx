import React, { useEffect, useState } from 'react';
import isEven from 'helpers/isEven';
import Spot from 'components/Spot';

interface Position {
  tile: string;
  x: number;
  y: number;
  isOccupied?: boolean;
  isFriendly?: boolean;
}

export default function Board() {
  // Todo: integrate pieces into each square created in board;
  const [state, setState] = useState({
    board: [],
    destination: {
      tile: '',
      x: 0,
      y: 0,
    },
  });

  function setDestination(tileInfo: Position) {
    setState((prev) => ({ ...prev, destination: tileInfo }));
  }

  useEffect(() => {
    let board: any = [];
    const alphaPosition = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const numericPosition = 0;
    for (let j = 8; j > numericPosition; j--) {
      alphaPosition.forEach((value, i) => {
        let spotColor;
        if ((isEven(i) && isEven(j)) || (!isEven(i) && !isEven(j))) {
          spotColor = 'beige';
        } else {
          spotColor = 'brown';
        }

        board.push(
          <Spot
            key={value + j}
            color={spotColor}
            tile={value + j}
            x={i + 1}
            y={j}
            setDestination={setDestination}
            destination={state.destination}
          />,
        );
      });
    }
    setState((prev) => ({ ...prev, board }));
  }, []);

  return <div className="board">{state.board}</div>;
}
