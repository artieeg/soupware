import { Injectable } from '@nestjs/common';
import { Room } from './room.types';

@Injectable()
export class RoomService {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  getRoom(room: string) {
    return this.rooms.get(room);
  }

  getOrCreate(room_id: string) {
    let room = this.rooms.get(room_id);

    if (!room) {
      room = { id: room_id, producers: [], users: [] };
      this.rooms.set(room_id, room);
    }

    return room;
  }
}
