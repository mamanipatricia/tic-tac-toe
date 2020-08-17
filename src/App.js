import React from "react";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic Tac Toe</h1>
      </header>
      <Game />
    </div>
  );
}

// helper function
const clone = (x) => JSON.parse(JSON.stringify(x));
function generateGrid(rows, columns, mapper) {
  return Array(rows)
    .fill()
    .map(() => Array(columns).fill().map(mapper));
}

const newTicTacToe = () => generateGrid(3, 3, () => null);

// const grid = [
//   [null, null, null],
//   [null, null, null],
//   [null, null, null]
// ]
function checkThree(a, b, c) {
  // `!variable`  verifica que exista un valor en las variables
  if (!a || !b || !c) return false;
  return a === b && b === c;
}
// ES2019 Array.prototype.flat()
// const flatten = (arr) => arr.reduce((acc, cur) => [...acc, ...cur], []);

function checkForWin(flatGrid) {
  const [nw, n, ne, w, c, e, sw, s, se] = flatGrid;
  return (
    checkThree(nw, n, ne) ||
    checkThree(w, c, e) ||
    checkThree(sw, s, se) ||
    checkThree(nw, w, sw) ||
    checkThree(n, c, s) ||
    checkThree(ne, e, se) ||
    checkThree(nw, c, se) ||
    checkThree(ne, c, sw)
  );
}

function checkForDraw(flatGrid) {
  return (
    !checkForWin(flatGrid) &&
    flatGrid.filter(Boolean).length === flatGrid.length
  );
}

const NEXT_TURN = {
  0: "X",
  X: "0",
};

const getInitialState = () => ({
  grid: newTicTacToe(),
  status: "inProgress",
  turn: "X",
});

const reducer = (state, action) => {
  if (state.status === "success" && action.type !== "RESET") {
    return state;
  } else {
  }
  switch (action.type) {
    case "RESET":
      return getInitialState();
    case "CLICK": {
      const { x, y } = action.payload;
      const { grid, turn } = state;
      if (grid[y][x]) {
        return state;
      }

      const nextState = clone(state);

      nextState.grid[y][x] = turn;
      // check for win here
      // const flatGrid = flatten(nextState.grid);
      const flatGrid = nextState.grid.flat();
      if (checkForWin(flatGrid)) {
        nextState.status = "success";
        return nextState;
      }

      if (checkForDraw(flatGrid)) {
        return getInitialState();
      }
      nextState.turn = NEXT_TURN[turn];

      return nextState;
    }

    default:
      return state;
  }
};

function Game() {
  // const grid = newTicTacToe();
  const [state, dispatch] = React.useReducer(reducer, getInitialState());
  const { grid, status, turn } = state;

  const handlerClick = (x, y) => {
    // console.log({ x, y });
    dispatch({ type: "CLICK", payload: { x, y } });
  };
  const reset = () => {
    dispatch({ type: "RESET" });
  };

  return (
    <div style={{ display: "inline-block" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Next turn: {turn}</div>
        <div>{status === "success" ? `${turn} won!` : null}</div>
        <button onClick={reset} type="button">
          Reset
        </button>
      </div>
      <Grid grid={grid} handlerClick={handlerClick} />
    </div>
  );
}

function Grid({ grid, handlerClick }) {
  return (
    <div style={{ display: "inline-block" }}>
      <div
        style={{
          background: "#444",
          display: "grid",
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridGap: 2,
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((value, colIdx) => (
            <Cell
              key={`${colIdx}-${rowIdx}`}
              onClick={() => {
                handlerClick(colIdx, rowIdx);
              }}
              value={value}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Cell({ value, onClick }) {
  return (
    <div style={{ backgroundColor: "#ddd", width: 100, height: 100 }}>
      <button
        style={{ width: "100%", height: "100%" }}
        onClick={onClick}
        type="button"
      >
        {value}
      </button>
    </div>
  );
}
