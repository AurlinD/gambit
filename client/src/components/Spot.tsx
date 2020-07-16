import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import Pawn from 'components/pieces/Pawn';
import Rook from 'components/pieces/Rook';
import Knight from 'components/pieces/Knight';
import Bishop from 'components/pieces/Bishop';
import Queen from 'components/pieces/Queen';
import King from 'components/pieces/King';
import { SpotsContext, Spots } from 'context/SpotsContext';
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
  castling: boolean;
  setCastling: Function;
  endPawn: boolean;
  setEndPawn: Function;
  endOfBoardPawn: boolean;
  setEndOfBoardPawn: Function;
  deletePawn: Position;
  setDeletePawn: Function;
  promotion: {
    pieceType: string;
    color: string;
  };
  setPromotion: Function;
}
const brown = '#8a604a';
const beige = '#e5d3ba';

export default function Spot(props: Props) {
  const { setSpotsContext, initSpotsContext, getSpotDetails } = useContext(SpotsContext);

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
    castling,
    setCastling,
    endPawn,
    setEndPawn,
    endOfBoardPawn,
    setEndOfBoardPawn,
    deletePawn,
    setDeletePawn,
    promotion,
    setPromotion,
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
    hasMoved: false,
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
    setState((prev) => ({ ...prev, ...initBoard }));
  }, [initBoard]);

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
    if (JSON.stringify(availableMoves).includes(JSON.stringify(getTileXY(state.tileInfo)))) {
      setState((prev) => ({ ...prev, isCircleVisible: true }));
    } else {
      setState((prev) => ({ ...prev, isCircleVisible: false }));
    }
  }, [availableMoves, state.tileInfo]);

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

  useEffect(() => {
    //WHITE CASTLING -----------------------------------------------------------------------

    if (castling && startPosition.tile === 'e1' && destination.tile === 'g1') {
      let kingSideRookWhite: Position = {
        tile: 'h1',
        x: 8,
        y: 1,
      };
      setKillPosition(kingSideRookWhite, true);
      if (state.tileInfo.tile === 'f1') {
        setState({
          ...state,
          activePiece: {
            pieceType: 'rook',
            color: 'white',
          },
          tileInfo: {
            tile: 'f1',
            x: 6,
            y: 1,
          },
          isOccupied: true,
          hasMoved: true,
        });
      }
    }
    if (castling && startPosition.tile === 'e1' && destination.tile === 'c1') {
      let queenSideRookWhite: Position = {
        tile: 'a1',
        x: 1,
        y: 1,
      };
      setKillPosition(queenSideRookWhite, true);
      if (state.tileInfo.tile === 'd1') {
        setState({
          ...state,
          activePiece: {
            pieceType: 'rook',
            color: 'white',
          },
          tileInfo: {
            tile: 'd1',
            x: 4,
            y: 1,
          },
          isOccupied: true,
          hasMoved: true,
        });
      }
    }

    //BLACK CASTLING -----------------------------------------------------------------------

    if (castling && startPosition.tile === 'e8' && destination.tile === 'g8') {
      let kingSideRookBlack: Position = {
        tile: 'h8',
        x: 8,
        y: 8,
      };
      setKillPosition(kingSideRookBlack, true);
      if (state.tileInfo.tile === 'f8') {
        setState({
          ...state,
          activePiece: {
            pieceType: 'rook',
            color: 'black',
          },
          tileInfo: {
            tile: 'f8',
            x: 6,
            y: 8,
          },
          isOccupied: true,
          hasMoved: true,
        });
      }
    }
    if (castling && startPosition.tile === 'e8' && destination.tile === 'c8') {
      let queenSideRookBlack: Position = {
        tile: 'a8',
        x: 1,
        y: 8,
      };
      setKillPosition(queenSideRookBlack, true);
      if (state.tileInfo.tile === 'd8') {
        setState({
          ...state,
          activePiece: {
            pieceType: 'rook',
            color: 'black',
          },
          tileInfo: {
            tile: 'd8',
            x: 4,
            y: 8,
          },
          isOccupied: true,
          hasMoved: true,
        });
      }
    }
  }, [castling, destination, startPosition.tile, setKillPosition, state]);

  useEffect(() => {
    // WHITE PAWN HAS REACHED END OF BOARD-----------------------------------------

    if (
      endPawn &&
      destination.activePiece.pieceType === 'pawn' &&
      destination.activePiece.color === 'white' &&
      destination.y === 8
    ) {
      let deletePawnWhite: Position = {
        tile: destination.tile,
        x: destination.x,
        y: destination.y,
      };
      setEndOfBoardPawn(true);
      setDeletePawn(deletePawnWhite);
      // setEndPawn(false);

      // setKillPosition(deletePawnWhite, true);

      // if (state.tileInfo.tile === destination.tile) {
      // setState({
      //   ...state,
      //   activePiece: {
      //     pieceType: 'queen',
      //     color: 'white',
      //   },
      //   tileInfo: {
      //     tile: destination.tile,
      //     x: destination.x,
      //     y: destination.y,
      //   },
      //   isOccupied: true,
      //   hasMoved: true,
      // });
      // }
    }

    // BLACK PAWN HAS REACHED END OF BOARD-----------------------------------------

    if (
      endPawn &&
      startPosition.activePiece.pieceType === 'pawn' &&
      startPosition.activePiece.color === 'black' &&
      destination.y === 1
    ) {
      let deletePawnBlack: Position = {
        tile: destination.tile,
        x: destination.x,
        y: destination.y,
      };
      setEndOfBoardPawn(true);
      // setDeletePawn(deletePawnBlack);
      // setKillPosition(deletePawnBlack, true);
      // if (state.tileInfo.tile === destination.tile) {
      //   setState({
      //     ...state,
      //     activePiece: {
      //       pieceType: 'queen',
      //       color: 'black',
      //     },
      //     tileInfo: {
      //       tile: destination.tile,
      //       x: destination.x,
      //       y: destination.y,
      //     },
      //     isOccupied: true,
      //     hasMoved: true,
      //   });
      // }
    }
  }, [endPawn, destination]);

  useEffect(() => {
    // let currentSpot = getSpotDetails(deletePawn.x, deletePawn.y);
    if (
      promotion.pieceType !== '' &&
      endOfBoardPawn &&
      state.tileInfo.tile === deletePawn.tile &&
      state.activePiece.pieceType === 'pawn'
    ) {
      setKillPosition(deletePawn, true);
      setState((prev) => ({
        ...prev,
        activePiece: {
          pieceType: promotion.pieceType,
          color: promotion.color,
        },
        isOccupied: true,
        hasMoved: true,
      }));

      // let emptyPromotion = {
      //   pieceType: '',
      //   color: '',
      // };
      // setPromotion(emptyPromotion);
    }
  }, [endOfBoardPawn, promotion.color, deletePawn, promotion.pieceType, setKillPosition]);

  const onMoveStart = () => {
    if (startPosition.tile) {
      setDestination(
        state.tileInfo,
        startPosition.activePiece.pieceType,
        startPosition.activePiece.color,
      );

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
            setKillPosition(state.tileInfo, false);
            setState({
              ...state,
              activePiece: {
                pieceType: startPosition.activePiece.pieceType,
                color: startPosition.activePiece.color,
              },
              isOccupied: true,
              hasMoved: true,
            });
          }
        }
      }

      setTileFocus();
      setAvailableMoves([]);
      setStartPosition({ x: 0, y: 0 }, '', '');
    }
  };

  return (
    <div
      className={`square ${props.color} ${props.tileFocus === state.tileInfo.tile ? 'focus' : ''}`}
      onClick={() => {
        onMoveStart();
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
          setCastling={setCastling}
          setEndPawn={setEndPawn}
        />
      )}

      {state.activePiece.pieceType === 'pawn' && state.activePiece.color === 'white' && (
        <Pawn
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
          setCastling={setCastling}
          setEndPawn={setEndPawn}
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
          setCastling={setCastling}
          setEndPawn={setEndPawn}
        />
      )}
      {state.activePiece.pieceType === 'rook' && state.activePiece.color === 'white' && (
        <Rook
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
          setCastling={setCastling}
          setEndPawn={setEndPawn}
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
          setCastling={setCastling}
          setEndPawn={setEndPawn}
        />
      )}
      {state.activePiece.pieceType === 'knight' && state.activePiece.color === 'white' && (
        <Knight
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
          setCastling={setCastling}
          setEndPawn={setEndPawn}
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
          setCastling={setCastling}
          setEndPawn={setEndPawn}
        />
      )}
      {state.activePiece.pieceType === 'bishop' && state.activePiece.color === 'white' && (
        <Bishop
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
          setCastling={setCastling}
          setEndPawn={setEndPawn}
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
          setCastling={setCastling}
          setEndPawn={setEndPawn}
        />
      )}
      {state.activePiece.pieceType === 'queen' && state.activePiece.color === 'white' && (
        <Queen
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
          setCastling={setCastling}
          setEndPawn={setEndPawn}
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
          setCastling={setCastling}
          setEndPawn={setEndPawn}
        />
      )}
      {state.activePiece.pieceType === 'king' && state.activePiece.color === 'white' && (
        <King
          tileInfo={state.tileInfo}
          white={true}
          setStartPosition={setStartPosition}
          setAvailableMoves={setAvailableMoves}
          setTileFocus={setTileFocus}
          setCastling={setCastling}
          setEndPawn={setEndPawn}
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
