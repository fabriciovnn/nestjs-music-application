import {
  ForbiddenException,
  Injectable,
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
    return this.playlistsRepository.create(userId, dto);
  }

  async findAll(user: { id: number; role: Role }) {
    if (user.role === Role.ADMIN) {
      return this.playlistsRepository.findAll();
    }

    return this.playlistsRepository.findAllByUserId(user.id);
  }

  async findOne(id: number, user: { id: number; role: Role }) {
    const playlist = await this.playlistsRepository.findById(id);
    if (!playlist) throw new NotFoundException('Playlist não encontrada');

    if (user.role !== Role.ADMIN && playlist.user_id !== user.id) {
      throw new ForbiddenException('Acesso negado à playlist');
    }

    return playlist;
  }

  async update(
    id: number,
    dto: UpdatePlaylistDto,
    user: { id: number; role: Role },
  ) {
    const playlist = await this.playlistsRepository.findById(id);
    if (!playlist) throw new NotFoundException('Playlist não encontrada');

    if (user.role !== Role.ADMIN && playlist.user_id !== user.id) {
      throw new ForbiddenException('Você não pode editar essa playlist');
    }

    return this.playlistsRepository.update(id, dto);
  }

  async remove(id: number, user: { id: number; role: Role }) {
    const playlist = await this.playlistsRepository.findById(id);
    if (!playlist) throw new NotFoundException('Playlist não encontrada');

    if (user.role !== Role.ADMIN && playlist.user_id !== user.id) {
      throw new ForbiddenException('Você não pode deletar essa playlist');
    }

    return this.playlistsRepository.delete(id);
  }
}
