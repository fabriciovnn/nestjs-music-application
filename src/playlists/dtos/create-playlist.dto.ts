import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsArray()
  @IsString({ each: true })
  musics: string[];
}
