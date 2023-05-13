import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Readable, Stream } from 'stream';
import { GridFSBucket, GridFSFile, GridFSBucketWriteStreamOptions } from 'mongodb';
import { FileInfo } from '@project/shared/app-types';
import { ObjectId } from 'bson';
import { Express } from 'express';
import 'multer';

@Injectable()
export class FileService {
  private bucket: GridFSBucket;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.bucket = new GridFSBucket(this.connection.db);
  }

  private writeFileStream(stream: Stream, filename: string, options: GridFSBucketWriteStreamOptions): Promise<GridFSFile> {
    return new Promise((resolve, reject) =>
      stream
        .pipe(
          this.bucket.openUploadStream(filename, {
            aliases: options.aliases,
            chunkSizeBytes: options.chunkSizeBytes,
            contentType: options.contentType,
            metadata: options.metadata,
          })
        )
        .on('error', async (err) => {
          reject(err);
        })
        .on('finish', async (item: GridFSFile) => {
          resolve(item);
        })
    );
  }

  public async findById(id: string): Promise<GridFSFile> {
    const files = await this.bucket.find({ _id: new ObjectId(id) }).toArray();

    if (!files.length) {
      throw new NotFoundException('File not found');
    }

    return files[0];
  }

  public async writeFile(file: Express.Multer.File, ownerId?: string): Promise<FileInfo> {
    const fileInfo = await this.writeFileStream(Readable.from(file.buffer), file.originalname, {
      contentType: file.mimetype,
      metadata: { ownerId },
    });

    return {
      id: fileInfo._id.toHexString(),
      filename: fileInfo.filename,
      contentType: fileInfo.contentType || '',
      uploadDate: fileInfo.uploadDate,
    };
  }

  public downloadFile(id: string) {
    return this.bucket.openDownloadStream(new ObjectId(id));
  }

  public async deleteFile(fileId: string, ownerId?: string) {
    const file = await this.findById(fileId);
    if (!file) {
      throw new NotFoundException();
    }

    if (file.metadata?.ownerId === ownerId) {
      return await this.bucket.delete(file._id);
    }

    throw new NotFoundException();
  }
}
