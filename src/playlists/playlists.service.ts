import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { Role } from 'generated/prisma';
import { UpdatePlaylistDto } from './dtos/update-playlist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlaylistsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreatePlaylistDto) {
    return this.prisma.playlist.create({
      data: { ...dto, user_id: userId },
    });
  }

  async findAll(user: { id: number; role: Role }) {
    if (user.role === Role.ADMIN) {
      return this.prisma.playlist.findMany();
    }

    return this.prisma.playlist.findMany({
      where: { user_id: user.id },
    });
  }

  async findOne(id: number, user: { id: number; role: Role }) {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
    });
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
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist) throw new NotFoundException('Playlist não encontrada');

    if (user.role !== Role.ADMIN && playlist.user_id !== user.id) {
      throw new ForbiddenException('Você não pode editar essa playlist');
    }

    return this.prisma.playlist.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, user: { id: number; role: Role }) {
    const playlist = await this.prisma.findUnique({ where: { id } });
    if (!playlist) throw new NotFoundException('Playlist não encontrada');

    if (user.role !== Role.ADMIN && playlist.user_id !== user.id) {
      throw new ForbiddenException('Você não pode deletar essa playlist');
    }

    return this.prisma.playlist.delete({ where: { id } });
  }
}
