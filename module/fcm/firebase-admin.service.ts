import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { logger } from 'utils/logger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { FirebaseAdminRepository } from './firebase-admin.repository';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  constructor(
    private readonly firebaseAdminRepository: FirebaseAdminRepository,
  ) {}

  onModuleInit() {
    if (!admin.apps.length) {
      try {
        let serviceAccount: any;

        if (process.env.FIREBASE_ADMIN_SDK) {
          // 🔹 Render/Production: biến môi trường chứa JSON string
          logger.info('Using Firebase service account from ENV variable');
          serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
        } else {
          // 🔹 Local: đọc file service account JSON
          const serviceAccountPath = join(
            __dirname,
            '..',
            'utils',
            'training-3f6e4-firebase-adminsdk-fbsvc-24a33b8098.json',
          );
          logger.info('Using Firebase service account from local file');
          serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        }

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: serviceAccount.project_id,
            clientEmail: serviceAccount.client_email,
            privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'), // fix lỗi xuống dòng
          }),
        });

        logger.info('✅ Firebase Admin initialized successfully');
      } catch (error) {
        logger.error('❌ Failed to initialize Firebase Admin:', error);
        throw error;
      }
    }
  }

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    image?: string,
    data: Record<string, string> = {},
  ) {
    return this.firebaseAdminRepository.sendPushNotification(
      token,
      title,
      body,
      image,
      data,
    );
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    logger.info(`Updating FCM token for user: ${userId}`);
    return this.firebaseAdminRepository.updateFcmToken(userId, fcmToken);
  }

  async getUserFcmInfo(userId: string) {
    const doc = await this.firebaseAdminRepository.findUserInfoWithFcm(userId);

    if (!doc) return null;

    return {
      fcm_token: doc.fcm_token,
      name: doc.userId?.name || null,
      avatar: doc.userId?.avatar || null,
    };
  }
}
