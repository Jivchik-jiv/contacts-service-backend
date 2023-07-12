import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  uploadAvatar(filePath: string) {
    const result = v2.uploader.upload(filePath, {
      folder: 'avatars',
      crop: 'fill',
      width: 250,
    });

    return result;
  }

  async deleteAvatar(id: string) {
    const result = await v2.uploader.destroy(id);
    console.log(
      '🚀 ~ file: cloudinary.service.ts:18 ~ CloudinaryService ~ deleteAvatar ~ result:',
      result,
    );
  }
}
