import { Injectable } from '@nestjs/common';
import { Transport } from 'mediasoup/node/lib/Transport';
import { Room } from './room.types';

@Injectable()
export class RoomService {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  async create(room_id: string, user: string, transport: Transport) {
    let room = this.rooms.get(room_id);

    if (!room) {
      room = { id: room_id, producers: [], users: [] };
    }

    room.users.push({ id: user, transport, consumers: [] });
  }
}
