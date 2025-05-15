import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { UpdatePlaylistDto } from './dtos/update-playlist.dto';
import { Role } from '@prisma/client';
import { PlaylistsRepository } from './playlists.repository';

@Injectable()
export class PlaylistsService {
  constructor(private playlistsRepository: PlaylistsRepository) {}

  async create(userId: number, dto: CreatePlaylistDto) {
    try {
      return this.playlistsRepository.create(userId, dto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao criar a playlist: ' + error.message,
      );
    }
  }

  async findAll(user: { id: number; role: Role }) {
    try {
      if (user.role === Role.ADMIN) {
        return this.playlistsRepository.findAll();
      }

      return this.playlistsRepository.findAllByUserId(user.id);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao listar playlists: ' + error.message,
      );
    }
  }

  async findOne(id: number, user: { id: number; role: Role }) {
    try {
      const playlist = await this.playlistsRepository.findById(id);
      if (!playlist) throw new NotFoundException('Playlist não encontrada');

      if (user.role !== Role.ADMIN && playlist.user_id !== user.id) {
        throw new ForbiddenException('Acesso negado à playlist');
      }

      return playlist;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao buscar a playlist: ' + error.message,
      );
    }
  }

  async update(
    id: number,
    dto: UpdatePlaylistDto,
    user: { id: number; role: Role },
  ) {
    try {
      const playlist = await this.playlistsRepository.findById(id);
      if (!playlist) throw new NotFoundException('Playlist não encontrada');

      if (user.role !== Role.ADMIN && playlist.user_id !== user.id) {
        throw new ForbiddenException('Você não pode editar essa playlist');
      }

      return this.playlistsRepository.update(id, dto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao atualizar a playlist: ' + error.message,
      );
    }
  }

  async remove(id: number, user: { id: number; role: Role }) {
    try {
      const playlist = await this.playlistsRepository.findById(id);
      if (!playlist) throw new NotFoundException('Playlist não encontrada');

      if (user.role !== Role.ADMIN && playlist.user_id !== user.id) {
        throw new ForbiddenException('Você não pode deletar essa playlist');
      }

      return this.playlistsRepository.delete(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao remover playlist: ' + error.message,
      );
    }
  }
}
