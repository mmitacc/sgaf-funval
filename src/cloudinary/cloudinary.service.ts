import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';
import * as path from 'path';

@Injectable()
export default class CloudinaryService {
  // Tu método actual intacto para fotos de perfil
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

  // Nuevo método para documentos y archivos de tareas del Aula Virtual
  async subirArchivoTarea(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    // 1. Separamos el nombre y la extensión original (ej. "obra misional" y ".xlsx")
    const extension = path.extname(file.originalname).toLowerCase();
    const nombreBase = path
      .basename(file.originalname, extension)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quita tildes
      .replace(/[^a-zA-Z0-9_-]/g, '_'); // Reemplaza espacios y símbolos por "_"

    // 2. Generamos un identificador único que CONSERVA la extensión original
    // Ejemplo: "1731429800123_obra_misional.xlsx"
    const publicIdConExtension = `${Date.now()}_${nombreBase}${extension}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'techuniversity/entregas',
          resource_type: 'auto',
          public_id: publicIdConExtension,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new Error('No se pudo subir el archivo a Cloudinary'),
            );
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
