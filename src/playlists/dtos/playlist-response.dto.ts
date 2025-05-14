import { ApiProperty } from '@nestjs/swagger';

export class PlaylistResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  genre: string;

  @ApiProperty()
  musics: string[];

  @ApiProperty()
  user_id: number;
}
