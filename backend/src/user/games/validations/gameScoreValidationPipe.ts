import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { AddGameScoreDto } from '../dto';

@Injectable()
export class GameScoreValidationPipe implements PipeTransform<AddGameScoreDto, AddGameScoreDto> {
  transform(value: AddGameScoreDto): AddGameScoreDto {
    const { game_name } = value;

    if (!Object.keys(value).includes(game_name)) {
      throw new BadRequestException(`The game_name "${game_name}" does not match any property in the DTO`);
    }

    return value;
  }
}
