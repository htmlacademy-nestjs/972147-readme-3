import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';
import { extname } from 'path';

export const MAX_IMAGE_SIZE = 1e6;

export const imagePostOptions: MulterOptions = {
  limits: {
    fileSize: MAX_IMAGE_SIZE,
  },
  fileFilter: (req: unknown, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (file.size > MAX_IMAGE_SIZE) {
      callback(new BadRequestException(`File size exceeds ${MAX_IMAGE_SIZE} bytes`), false);
      return;
    }
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(new BadRequestException(`Unsupported file type ${extname(file.originalname)}`), false);
      return;
    }
    callback(null, true);
  },
  storage: memoryStorage(),
};
