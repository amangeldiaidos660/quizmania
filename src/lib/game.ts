import { ANSWER_SLOTS, DOUBT_START, PLAYER_START, STAGE_ONE_MAP } from "@/assets/game/maps";
import type { AnswerOption, Direction, Position } from "@/types/game";

export const TILE_SIZE = 44;

const directionDelta: Record<Direction, Position> = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

export function getInitialPlayerPosition() {
  return { ...PLAYER_START };
}

export function getInitialDoubtPosition() {
  return { ...DOUBT_START };
}

export function isWall(position: Position) {
  return STAGE_ONE_MAP[position.row]?.[position.col] === "#";
}

export function samePosition(a: Position, b: Position) {
  return a.row === b.row && a.col === b.col;
}

export function movePosition(position: Position, direction: Direction) {
  const delta = directionDelta[direction];
  const next = { row: position.row + delta.row, col: position.col + delta.col };
  return isWall(next) ? position : next;
}

export function getAnswerPositions(answers: AnswerOption[]) {
  const shuffledSlots = [...ANSWER_SLOTS].sort(() => Math.random() - 0.5);

  return answers.map((answer, index) => ({
    answer,
    position: shuffledSlots[index],
  }));
}

export function moveDoubtTowardPlayer(doubt: Position, player: Position) {
  const options: Position[] = [];
  const rowStep = Math.sign(player.row - doubt.row);
  const colStep = Math.sign(player.col - doubt.col);

  if (Math.abs(player.row - doubt.row) >= Math.abs(player.col - doubt.col) && rowStep !== 0) {
    options.push({ row: doubt.row + rowStep, col: doubt.col });
  }

  if (colStep !== 0) {
    options.push({ row: doubt.row, col: doubt.col + colStep });
  }

  if (rowStep !== 0) {
    options.push({ row: doubt.row + rowStep, col: doubt.col });
  }

  const next = options.find((option) => !isWall(option));
  return next ?? doubt;
}

export function clampQuestionCount(value: number) {
  if (Number.isNaN(value)) return 3;
  return Math.min(Math.max(value, 3), 15);
}
