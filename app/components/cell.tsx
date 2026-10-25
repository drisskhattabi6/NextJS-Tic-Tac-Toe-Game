type Player = "circle" | "cross";
type CellValue = Player | "";

type CellProps = {
  id: number;
  cell: CellValue;
  onClick: (id: number) => void;
  disabled: boolean;
  isLastMove: boolean;
};

export default function Cell({
  id,
  cell,
  onClick,
  disabled,
  isLastMove,
}: CellProps) {
  const symbol =
    cell === "circle" ? "O" : cell === "cross" ? "X" : "";

  const playerName =
    cell === "circle"
      ? "Circle"
      : cell === "cross"
        ? "Cross"
        : "Empty";

  return (
    <button
      type="button"
      className={[
        "square",
        cell || "empty",
        isLastMove ? "lastMove" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onClick(id)}
      disabled={disabled || cell !== ""}
      aria-label={`Cell ${id + 1}: ${playerName}`}
      aria-pressed={cell !== ""}
    >
      <span>{symbol}</span>
    </button>
  );
}