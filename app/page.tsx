"use client";

import { useState } from "react";
import Cell from "./components/cell";

type Player = "circle" | "cross";
type CellValue = Player | "";

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const createEmptyBoard = (): CellValue[] => Array(9).fill("");

function getWinner(cells: CellValue[]): Player | null {
  for (const [a, b, c] of WINNING_COMBOS) {
    const value = cells[a];

    if (value && value === cells[b] && value === cells[c]) {
      return value;
    }
  }

  return null;
}

export default function Home() {
  const [cells, setCells] =
    useState<CellValue[]>(createEmptyBoard);

  const [go, setGo] = useState<Player>("circle");
  const [lastMove, setLastMove] = useState<number | null>(null);

  const [scores, setScores] = useState<Record<Player, number>>({
    circle: 0,
    cross: 0,
  });

  const winner = getWinner(cells);
  const isDraw =
    winner === null && cells.every((cell) => cell !== "");

  const gameOver = winner !== null || isDraw;

  function handleMove(id: number) {
    if (gameOver || cells[id] !== "") {
      return;
    }

    const nextCells = [...cells];
    nextCells[id] = go;

    setCells(nextCells);
    setLastMove(id);

    const roundWinner = getWinner(nextCells);

    if (roundWinner) {
      setScores((current) => ({
        ...current,
        [roundWinner]: current[roundWinner] + 1,
      }));
    }

    setGo(go === "circle" ? "cross" : "circle");
  }

  function startNewRound() {
    setCells(createEmptyBoard());
    setGo("circle");
    setLastMove(null);
  }

  function resetMatch() {
    startNewRound();
    setScores({ circle: 0, cross: 0 });
  }

  const statusMessage = winner
    ? `${winner === "circle" ? "Circle" : "Cross"} wins!`
    : isDraw
      ? "It's a draw!"
      : "Your turn";

  return (
    <main className="container">
      <section className="game-shell">
        <header className="game-header">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-circle">O</span>
            <span className="brand-cross">X</span>
          </div>

          <span className="game-label">TWO-PLAYER GAME</span>
          <h1>Tic-Tac-Toe</h1>
          <p className="subtitle">
            A little strategy goes a long way.
          </p>
        </header>

        <div className="game-layout">
          {/* Left: Game board */}
          <section className="board-column" aria-label="Game board">
            <div
              className="gameboard"
              role="group"
              aria-label="Tic-Tac-Toe board"
            >
              {cells.map((cell, index) => (
                <Cell
                  key={index}
                  id={index}
                  cell={cell}
                  onClick={handleMove}
                  disabled={gameOver}
                  isLastMove={lastMove === index}
                />
              ))}
            </div>
          </section>

          {/* Right: Score, status, and controls */}
          <aside className="game-sidebar">
            <div className="sidebar-heading">
              <span className="game-label">MATCH OVERVIEW</span>
              <span className="round-label">
                {gameOver ? "ROUND COMPLETE" : "ROUND IN PROGRESS"}
              </span>
            </div>

            <section className="scoreboard" aria-label="Player scores">
              <div
                className={`score-card circle-score ${
                  !gameOver && go === "circle" ? "active" : ""
                }`}
              >
                <span className="player-symbol" aria-hidden="true">O</span>

                <div className="score-details">
                  <span className="player-name">Circle</span>
                  <span className="player-caption">Player 1</span>
                </div>

                <strong className="score-value">{scores.circle}</strong>
              </div>

              <div
                className={`score-card cross-score ${
                  !gameOver && go === "cross" ? "active" : ""
                }`}
              >
                <span className="player-symbol" aria-hidden="true">X</span>

                <div className="score-details">
                  <span className="player-name">Cross</span>
                  <span className="player-caption">Player 2</span>
                </div>

                <strong className="score-value">{scores.cross}</strong>
              </div>
            </section>

            <div
              className={`status-card ${
                winner ? "winner" : isDraw ? "draw" : ""
              }`}
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="status-indicator" aria-hidden="true" />

              <span>{statusMessage}</span>

              {!gameOver && (
                <strong className={`turn-chip ${go}`}>
                  {go === "circle" ? "O Circle" : "X Cross"}
                </strong>
              )}
            </div>

            <div className="game-actions">
              <button
                type="button"
                className="restart-button"
                onClick={startNewRound}
              >
                <span aria-hidden="true">↻</span>
                {gameOver ? "Play again" : "New round"}
              </button>

              <button
                type="button"
                className="reset-button"
                onClick={resetMatch}
              >
                Reset scores
              </button>
            </div>

            <div className="sidebar-tip">
              <span className="tip-icon" aria-hidden="true">✦</span>
              <p>
                <strong>How to win</strong>
                <span>Get three symbols in a row, column, or diagonal.</span>
              </p>
            </div>
          </aside>
        </div>

      </section>
    </main>
  );
}