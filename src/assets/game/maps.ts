import type { Position } from "@/types/game";

export const STAGE_ONE_MAP = [
  "###############",
  "#P....#....A..#",
  "#.###.#.###.#.#",
  "#.....#.....#.#",
  "###.#.###.#.#.#",
  "#...#.....#...#",
  "#.#.#####.###.#",
  "#.#.....D.....#",
  "#.###.#####.#.#",
  "#...#.....#...#",
  "#.#.#.###.#.###",
  "#.#.....#.....#",
  "#.#.###.#.###.#",
  "#..A....#..A.A#",
  "###############",
] as const;

export const PLAYER_START: Position = { row: 1, col: 1 };

export const DOUBT_START: Position = { row: 7, col: 7 };

export const ANSWER_SLOTS: Position[] = [
  { row: 1, col: 11 },
  { row: 13, col: 3 },
  { row: 13, col: 10 },
  { row: 13, col: 13 },
];
