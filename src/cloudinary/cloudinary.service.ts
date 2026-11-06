import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export default class CloudinaryService {
  async subirImagen(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'clinica/perfiles',
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          transformation: [{ width: 500, height: 500, crop: 'limit' }],
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new Error('No se pudo obtener respuesta de Cloudinary'),
            );
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
