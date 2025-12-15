export type GamesMockProps = {
  gamesMock: {
    todayGame: {
      name: string;
      gameCode: string;
      completed: boolean;
    };
    moreGames: {
      name: string;
      gameCode: string;
    }[];
  };
};

export type ImagesKeys = {
  game_2048: string;
  memory: string;
  snake: string;
  sudoku: string;
  tic_tac_toe: string;
  word_guess: string;
  wordle: string;
};

export type GamesKeys = {
  Game_2048: string;
  Memory: string;
  Snake: string;
  Sudoku: string;
  Tic_tac_toe: string;
  Word_guess: string;
  Wordle: string;
};
