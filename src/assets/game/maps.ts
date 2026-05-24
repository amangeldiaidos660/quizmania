import type { EnemyId, Position, StageId } from "@/types/game";

export type StageMapConfig = {
  id: StageId;
  title: string;
  layout: readonly string[];
  playerStart: Position;
  enemyStarts: Record<EnemyId, Position>;
  answerSlots: Position[];
  powerUpSlots: Position[];
};

export const STAGE_MAPS: Record<StageId, StageMapConfig> = {
  1: {
    id: 1,
    title: "Разминка разума",
    layout: [
      "###############",
      "#P....#.......#",
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
      "#.............#",
      "###############",
    ],
    playerStart: { row: 1, col: 1 },
    enemyStarts: {
      doubt: { row: 7, col: 7 },
      confusion: { row: 7, col: 7 },
      panic: { row: 7, col: 7 },
    },
    answerSlots: [
      { row: 1, col: 11 },
      { row: 3, col: 3 },
      { row: 3, col: 11 },
      { row: 5, col: 1 },
      { row: 5, col: 13 },
      { row: 9, col: 1 },
      { row: 9, col: 13 },
      { row: 11, col: 5 },
      { row: 11, col: 11 },
      { row: 13, col: 3 },
      { row: 13, col: 10 },
      { row: 13, col: 13 },
    ],
    powerUpSlots: [
      { row: 1, col: 3 },
      { row: 5, col: 9 },
      { row: 11, col: 3 },
      { row: 13, col: 7 },
    ],
  },
  2: {
    id: 2,
    title: "Коридоры путаницы",
    layout: [
      "###############",
      "#P..#.....#...#",
      "#.#.#.###.#.#.#",
      "#.#.....#...#.#",
      "#.#####.#.###.#",
      "#.....#.#.....#",
      "###.#.#.###.#.#",
      "#...#...D...#.#",
      "#.#.###.#.#.#.#",
      "#.#.....#.#...#",
      "#.###.###.###.#",
      "#...#.....#...#",
      "#.#.#.#####.#.#",
      "#...#.......#.#",
      "###############",
    ],
    playerStart: { row: 1, col: 1 },
    enemyStarts: {
      doubt: { row: 7, col: 7 },
      confusion: { row: 11, col: 7 },
      panic: { row: 7, col: 7 },
    },
    answerSlots: [
      { row: 1, col: 3 },
      { row: 1, col: 9 },
      { row: 3, col: 5 },
      { row: 3, col: 11 },
      { row: 5, col: 3 },
      { row: 5, col: 11 },
      { row: 7, col: 3 },
      { row: 9, col: 5 },
      { row: 9, col: 13 },
      { row: 11, col: 3 },
      { row: 11, col: 11 },
      { row: 13, col: 7 },
    ],
    powerUpSlots: [
      { row: 3, col: 1 },
      { row: 5, col: 9 },
      { row: 9, col: 1 },
      { row: 13, col: 3 },
    ],
  },
  3: {
    id: 3,
    title: "Паника финала",
    layout: [
      "###############",
      "#P..#...#.....#",
      "#.#.#.#.#.###.#",
      "#.#...#...#...#",
      "#.###.#####.#.#",
      "#...#.....#.#.#",
      "###.###.#.#.#.#",
      "#.....#D#...#.#",
      "#.###.#.#.###.#",
      "#.#...#.#.....#",
      "#.#.###.#####.#",
      "#.#.....#.....#",
      "#.#####.#.###.#",
      "#.......#.....#",
      "###############",
    ],
    playerStart: { row: 1, col: 1 },
    enemyStarts: {
      doubt: { row: 7, col: 7 },
      confusion: { row: 11, col: 5 },
      panic: { row: 3, col: 11 },
    },
    answerSlots: [
      { row: 1, col: 3 },
      { row: 1, col: 11 },
      { row: 3, col: 3 },
      { row: 3, col: 13 },
      { row: 5, col: 3 },
      { row: 5, col: 9 },
      { row: 7, col: 3 },
      { row: 9, col: 3 },
      { row: 9, col: 11 },
      { row: 11, col: 5 },
      { row: 11, col: 13 },
      { row: 13, col: 5 },
    ],
    powerUpSlots: [
      { row: 3, col: 1 },
      { row: 5, col: 13 },
      { row: 9, col: 5 },
      { row: 13, col: 1 },
    ],
  },
};

export const STAGE_ONE_MAP = STAGE_MAPS[1].layout;

export const PLAYER_START = STAGE_MAPS[1].playerStart;

export const DOUBT_START = STAGE_MAPS[1].enemyStarts.doubt;

export const ANSWER_SLOTS = STAGE_MAPS[1].answerSlots;
