import { ApiProperty } from '@nestjs/swagger';

class Game2048 {
  @ApiProperty()
  start_number: number = 2;

  @ApiProperty()
  end_number: number = 2;

  @ApiProperty()
  size_of_field: number = 2;
}

class Memory {
  @ApiProperty()
  number_of_cards_to_pair: number = 2;

  @ApiProperty()
  complexity_level: number = 2;

  complexity_of_cards: string =
    'Simple images, representing common and known stimuli, e.g food, pets, with different colours';

  @ApiProperty()
  expected_number_of_tries: number = 2;

  @ApiProperty()
  number_of_hints: number = 2;
}

class Snake {
  @ApiProperty()
  number_of_hearts: number = 2;
}

class TicTacToe {
  @ApiProperty()
  number_of_games_to_play: number = 2;

  @ApiProperty()
  number_of_games_to_win: number = 2;

  @ApiProperty()
  computer_behaviour: string = 'Human like experience';

  @ApiProperty()
  number_of_fields: number = 2;

  @ApiProperty()
  number_of_figures_in_one_line_to_win: number = 2;
}

class Sudoku {
  @ApiProperty()
  number_of_squares: number = 2;
}

class WordGuess {
  @ApiProperty()
  number_of_words_to_guess: number = 2;

  @ApiProperty()
  word_length: number = 2;

  @ApiProperty()
  number_of_hearts: number = 2;

  @ApiProperty()
  number_of_hints: number = 2;
}

class Wordle {
  @ApiProperty()
  number_of_chances: number = 2;

  @ApiProperty()
  number_of_hints: number = 2;
}

export const userGameRulesResponseDto = [Game2048, Memory, Snake, TicTacToe, Sudoku, WordGuess, Wordle];
