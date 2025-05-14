import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePlaylistDto {
  @ApiPropertyOptional({
    description: 'Nome atualizado da playlist',
    example: 'Rock pesado 2025',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Gênero atualizado da playlist',
    example: 'Metal',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  genre?: string;

  @ApiPropertyOptional({
    description: 'Lista atualizada de músicas',
    example: ['snuff', 'psychosocial', 'dead memories'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  musics?: string[];
}
