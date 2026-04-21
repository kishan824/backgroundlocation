import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { LocationService } from './location.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private locationService: LocationService) {}

  // 🔵 CONNECTION HANDLER
  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId; // ✅ FIXED HERE

    console.log('🔵 Incoming connection...');

    if (!userId) {
      console.log('❌ userId missing from auth');
      client.disconnect();
      return;
    }

    // store userId inside socket (VERY IMPORTANT)
    client.data.userId = userId;

    // join room
    client.join(userId);

    console.log(`🟢 User Connected: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    console.log('🔴 Client disconnected:', client.id);
  }

  @SubscribeMessage('sendLocation')
  async handleLocation(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('📩 Received location:', data);

      const userId = client.data.userId;
      const { lat, lng } = data;

      if (!userId || !lat || !lng) {
        return {
          success: false,
          message: 'Invalid data',
        };
      }

      // save to DB
      await this.locationService.saveLocation({
        userId,
        lat,
        lng,
      });

      // broadcast to same user room
      this.server.to(userId).emit('receiveLocation', {
        userId,
        lat,
        lng,
        time: Date.now(),
      });

      console.log('📤 Broadcast sent to room:', userId);

      return {
        success: true,
        message: 'Location saved successfully',
      };
    } catch (error) {
      console.log('❌ Error saving location:', error);

      return {
        success: false,
        message: 'Server error',
      };
    }
  }
}
