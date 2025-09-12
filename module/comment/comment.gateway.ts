import {
     WebSocketGateway,
     WebSocketServer,
     SubscribeMessage,
     MessageBody,
     ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
     cors: { origin: 'http://localhost:3000' },
})
export class CommentGateway {
     @WebSocketServer()
     server: Server;

     @SubscribeMessage('joinPost')
     handleJoinPost(@MessageBody() postId: string, @ConnectedSocket() client: Socket) {
          client.join(postId);
          console.log(`Client ${client.id} joined post ${postId}`);
     }

     @SubscribeMessage('leavePost')
     handleLeavePost(@MessageBody() postId: string, @ConnectedSocket() client: Socket) {
          client.leave(postId);
          console.log(`Client ${client.id} left post ${postId}`);
     }

     @SubscribeMessage('typing')
     handleTyping(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
          // data = { postId, user }
          client.to(data.postId).emit('userTyping', data.user);
     }

     @SubscribeMessage('stopTyping')
     handleStopTyping(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
          // data = { postId, user }
          client.to(data.postId).emit('userStopTyping', data.user);
     }

     // Khi có comment mới
     sendNewComment(postId: string, comment: any) {
          this.server.to(postId).emit('newComment', comment);
     }

     // Khi comment đang được tạo (loading state)
     sendCommentLoading(postId: string, tempComment: any) {
          this.server.to(postId).emit('commentLoading', tempComment);
     }

     // Khi comment đã được lưu thành công
     sendCommentSaved(postId: string, tempId: string, savedComment: any) {
          this.server.to(postId).emit('commentSaved', { tempId, savedComment });
     }

     // Khi comment bị lỗi
     sendCommentError(postId: string, tempId: string, error: any) {
          this.server.to(postId).emit('commentError', { tempId, error });
     }
}
