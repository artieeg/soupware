import { Injectable } from '@nestjs/common';
import { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport';
import { Room } from './types';

@Injectable()
export class RoomService {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  create(room_id: string, user: string, transport: WebRtcTransport) {
    let room = this.rooms.get(room_id);

    if (!room) {
      room = { id: room_id, users: [] };

      this.rooms.set(room_id, room);
    }

    room.users.push({ id: user, transport, producers: {} });
  }

  get(room: string) {
    return this.rooms.get(room);
  }

  getUser(room: string, user: string) {
    return this.rooms.get(room).users.find((u) => u.id === user);
  }
}