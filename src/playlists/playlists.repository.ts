import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlaylistDto } from './dtos/create-playlist.dto';
import { UpdatePlaylistDto } from './dtos/update-playlist.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PlaylistsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, dto: CreatePlaylistDto) {
    return this.prisma.playlist.create({
      data: {
        ...dto,
        user: { connect: { id: userId } },
      },
    });
  }

  findAll() {
    return this.prisma.playlist.findMany();
  }

  findAllByUserId(userId: number) {
    return this.prisma.playlist.findMany({
      where: { user_id: userId },
    });
  }

  findById(id: number) {
    return this.prisma.playlist.findUnique({
      where: { id },
    });
  }

  update(id: number, dto: UpdatePlaylistDto) {
    return this.prisma.playlist.update({
      where: { id },
      data: dto,
    });
  }

  delete(id: number) {
    return this.prisma.playlist.delete({
      where: { id },
    });
  }
}
