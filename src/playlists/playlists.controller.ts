import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  Get,
  ParseIntPipe,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { UpdatePlaylistDto } from './dtos/update-playlist.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlaylistResponseDto } from './dtos/playlist-response.dto';

@ApiBearerAuth()
@ApiTags('Playlists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova playlist' })
  @ApiResponse({
    status: 201,
    description: 'Playlist criada com sucesso',
    type: PlaylistResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não Autorizado' })
  create(@Request() req, @Body() dto: CreatePlaylistDto) {
    return this.playlistsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista todas as playlists (ADMIN) ou do próprio usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de playlists retornada com sucesso',
    type: [PlaylistResponseDto],
  })
  findAll(@Request() req) {
    return this.playlistsService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma playlist pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Playlist retornada com sucesso',
    type: PlaylistResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Acesso negado à playlist' })
  @ApiResponse({ status: 404, description: 'Playlist não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.playlistsService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma playlist pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Playlist atualizada com sucesso',
    type: PlaylistResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Você não pode editar essa playlist',
  })
  @ApiResponse({ status: 404, description: 'Playlist não encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma playlist pelo ID' })
  @ApiResponse({
    status: 200,
    description: 'Playlist removida com sucesso',
    type: PlaylistResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Você não pode deletar essa playlist',
  })
  @ApiResponse({ status: 404, description: 'Playlist não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.playlistsService.remove(id, req.user);
  }
}
