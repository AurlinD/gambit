import { useState, useCallback } from 'react';
import { SpotsContext } from 'context/SpotsContext';

export const useSpots = () => {
  const [state, setState] = useState({
    spotsContainer: [
      {
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
      },
    ],
  });

  const setSpotsContext = useCallback(
    (newSpot) => {
      state.spotsContainer.forEach((spot, index) => {
        // comparingg tile for tile
        if (newSpot.tileInfo.tile === spot.tileInfo.tile) {
          // once we know that we're comparing the same tiles together,
          // check if they have any difference, i.e. if a piece has moved,
          // this will trigger.
          if (JSON.stringify(spot) !== JSON.stringify(newSpot)) {
            // create a shallow copy of the state, which we will use
            // to set the state after a modification
            let stateShallowCopy = state.spotsContainer.slice();

            // at the index where we've found that something has changed,
            // apply said change and set the state with this change.
            stateShallowCopy[index] = newSpot;
            setState(() => ({ spotsContainer: stateShallowCopy }));
          }
        }
      });
    },
    [state.spotsContainer],
  );

  const initSpotsContext = useCallback((newSpot) => {
    setState((prev) => ({ ...prev, spotsContainer: [...prev.spotsContainer, newSpot] }));
  }, []);

  const spots = state.spotsContainer;

  return {
    spots,
    setSpotsContext,
    initSpotsContext,
  };
};
