import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaylistDto {
  @ApiProperty({ description: 'Nome da playlist', example: 'Rock Pesado' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Gênero da playlist',
    example: 'Metalcore',
  })
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiProperty({
    description: 'Lista de nome das músicas',
    example: ['just-pretend', 'limits', 'like a villain'],
  })
  @IsArray()
  @IsString({ each: true })
  musics: string[];
}
