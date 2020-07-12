import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import Pawn from 'components/pieces/Pawn';
import Rook from 'components/pieces/Rook';
import Knight from 'components/pieces/Knight';
import Bishop from 'components/pieces/Bishop';
import Queen from 'components/pieces/Queen';
import King from 'components/pieces/King';
import { SpotsContext } from 'context/SpotsContext';
import { useGenerateBoard } from 'hooks/useGenerateBoard';
interface Position {
  tile: string;
  x: number;
  y: number;
  isOccupied?: boolean;
  isFriendly?: boolean;
}

interface StartPosition extends Position {
  activePiece: {
    pieceType: string;
    color: string;
  };
}

interface Props {
  color: string;
  tile: string;
  x: number;
  y: number;
  setDestination: Function;
  destination: StartPosition;
  setStartPosition: Function;
  startPosition: StartPosition;
  tileFocus: string;
  setTileFocus: Function;
  availableMoves: {
    x: number;
    y: number;
  }[];
  setAvailableMoves: Function;
  killPosition: string;
  setKillPosition: Function;
  legalMoves: {
    x: number;
    y: number;
  }[];
  setLegalMoves: Function;
  occupiedChecker: {
    x: number;
    y: number;
  }[];
  setOccupiedChecker: Function;
}
const brown = '#8a604a';
const beige = '#e5d3ba';

export default function Spot(props: Props) {
  const { setSpotsContext, initSpotsContext } = useContext(SpotsContext);

  const {
    tile,
    x,
    y,
    destination,
    setDestination,
    setStartPosition,
    startPosition,
    setTileFocus,
    availableMoves,
    setAvailableMoves,
    killPosition,
    setKillPosition,
    legalMoves,
    setLegalMoves,
    occupiedChecker,
    setOccupiedChecker,
  } = props;

  const [state, setState] = useState({
    activePiece: {
      pieceType: '',
      color: '',
    },
    tileInfo: {
      tile: '',
      x: 0,
      y: 0,
    },
    isOccupied: false,
    isCircleVisible: false,
    hasUpdated: false,
  });

  let labelColor = '';
  switch (props.color) {
    case 'brown':
      labelColor = beige;
      break;
    case 'beige':
      labelColor = brown;
  }

  const initBoard = useGenerateBoard(tile, x, y);

  useEffect(() => {
    setState((prev) => ({...prev, ...initBoard}))
  }, [initBoard])

  useLayoutEffect(() => {
    if (state.tileInfo.tile === killPosition) {
      setState((prev) => ({
        ...prev,
        activePiece: { color: '', pieceType: '' },
        isOccupied: false,
        isCircleVisible: false,
      }));
    }
  }, [killPosition, state.tileInfo.tile]);

  useEffect(() => {
    let unoccupiedMoves = [];
    for (let move of availableMoves) {
      if (state.isOccupied === true) {
        if (
          JSON.stringify(move) === JSON.stringify(getTileXY(state.tileInfo)) &&
          startPosition.activePiece.color !== state.activePiece.color
        ) {
          unoccupiedMoves.push(move);
        }
      } else {
        if (JSON.stringify(move) === JSON.stringify(getTileXY(state.tileInfo))) {
          unoccupiedMoves.push(move);
        }
      }
    }

    if (unoccupiedMoves.length) {
      setLegalMoves(unoccupiedMoves);
    }
  }, [
    availableMoves,
    state.isOccupied,
    state.tileInfo,
    state.activePiece,
    startPosition.activePiece.color,
  ]);

  useEffect(() => {
    if (JSON.stringify(legalMoves).includes(JSON.stringify(getTileXY(state.tileInfo)))) {
      setState((prev) => ({ ...prev, isCircleVisible: true }));
    } else {
      setState((prev) => ({ ...prev, isCircleVisible: false }));
    }
  }, [legalMoves, state.tileInfo]);

  const getTileXY = (tileInfo: Position) => {
    return {
      x: tileInfo.x,
      y: tileInfo.y,
    };
  };

  useEffect(() => {
    if (state.hasUpdated) {
      initSpotsContext(state);
    }
  }, [state.hasUpdated, initSpotsContext]);

  useEffect(() => {
    setSpotsContext(state);
  }, [setSpotsContext, state]);

  return (
    <div
      className={`square ${props.color} ${props.tileFocus === state.tileInfo.tile ? 'focus' : ''}`}
      onClick={() => {
        if (startPosition.tile) {
          setDestination(state.tileInfo);
          if (!destination.isFriendly) {
            for (
              let availableCounter = 0;
              availableCounter < availableMoves.length;
              availableCounter++
            ) {
              if (
                state.activePiece.color !== startPosition.activePiece.color &&
                state.tileInfo.x === availableMoves[availableCounter].x &&
                state.tileInfo.y === availableMoves[availableCounter].y
              ) {
                setKillPosition(state.tileInfo);
                setState({
                  ...state,
                  activePiece: {
                    pieceType: startPosition.activePiece.pieceType,
                    color: startPosition.activePiece.color,
                  },
                  isOccupied: true,
                });
              }
            }
          }

          setTileFocus();
          setAvailableMoves([]);
          setStartPosition({ x: 0, y: 0 }, '', '');
        }
      }}
    >
      {/* Pawn START */}
      {state.activePiece.pieceType === 'pawn' && state.activePiece.color === 'black' && (
        <Pawn
          tileInfo={state.tileInfo}
          white={false}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
        />
      )}

      {state.activePiece.pieceType === 'pawn' && state.activePiece.color === 'white' && (
        <Pawn
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
        />
      )}

      {/* Pawn END */}

      {/* Rook START*/}
      {state.activePiece.pieceType === 'rook' && state.activePiece.color === 'black' && (
        <Rook
          tileInfo={state.tileInfo}
          white={false}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
        />
      )}
      {state.activePiece.pieceType === 'rook' && state.activePiece.color === 'white' && (
        <Rook
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
        />
      )}
      {/* Rook END */}

      {/* Knight START */}
      {state.activePiece.pieceType === 'knight' && state.activePiece.color === 'black' && (
        <Knight
          tileInfo={state.tileInfo}
          white={false}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
        />
      )}
      {state.activePiece.pieceType === 'knight' && state.activePiece.color === 'white' && (
        <Knight
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
        />
      )}
      {/* Knight END */}

      {/* Bishop START */}
      {state.activePiece.pieceType === 'bishop' && state.activePiece.color === 'black' && (
        <Bishop
          tileInfo={state.tileInfo}
          white={false}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
          setOccupiedChecker={setOccupiedChecker}
          occupiedChecker={occupiedChecker}
        />
      )}
      {state.activePiece.pieceType === 'bishop' && state.activePiece.color === 'white' && (
        <Bishop
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
          setOccupiedChecker={setOccupiedChecker}
          occupiedChecker={occupiedChecker}
        />
      )}
      {/* Bishop END */}

      {/* Queen START */}
      {state.activePiece.pieceType === 'queen' && state.activePiece.color === 'black' && (
        <Queen
          tileInfo={state.tileInfo}
          white={false}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
        />
      )}
      {state.activePiece.pieceType === 'queen' && state.activePiece.color === 'white' && (
        <Queen
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
        />
      )}
      {/* Queen END */}

      {/* King START */}
      {state.activePiece.pieceType === 'king' && state.activePiece.color === 'black' && (
        <King
          tileInfo={state.tileInfo}
          white={false}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
        />
      )}
      {state.activePiece.pieceType === 'king' && state.activePiece.color === 'white' && (
        <King
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
        />
      )}
      {/* King END */}

      <span className='square-position' style={{ color: labelColor }}>
        {props.tile}
      </span>
      <span
        className='available-moves-circle'
        style={state.isCircleVisible ? { display: 'block' } : { display: 'none' }}
      ></span>
    </div>
  );
}
