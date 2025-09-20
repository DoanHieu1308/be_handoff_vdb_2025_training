import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationsModule } from '../notification/notification.module';
import { FirebaseAdmin, FirebaseAdminSchema } from './firebase-admin.model';
import { FriendSchema } from '../firends/friend.model';
import { FirebaseAdminService } from './firebase-admin.service';
import { FirebaseAdminRepository } from './firebase-admin.repository';
import { FirebaseAdminController } from './firebase-admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: FirebaseAdmin.name,
          schema: FirebaseAdminSchema,
        },
      ],
      'MONGODB_CONNECTION',
    ),
  
  ],
  controllers: [FirebaseAdminController],
  providers: [FirebaseAdminService, FirebaseAdminRepository],
  exports: [MongooseModule, FirebaseAdminService, FirebaseAdminRepository],
})
export class FirebaseAdminModule {}
