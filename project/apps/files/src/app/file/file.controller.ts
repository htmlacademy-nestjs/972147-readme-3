import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import 'multer';
import { FileService } from './file.service';
import { fillObject } from '@project/util/util-core';
import { FileInfoRdo } from '../rdo/file-info.rdo';
import { ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from '../dto/file-upload.dto';
import { MongoidValidationPipe } from "@project/shared/shared-pipes";
import { AuthAccessGuard } from "../auth/guards/auth-access.guard";
import { ExtractUser } from "@project/shared/shared-decorators";
import { User } from "@project/shared/app-types";

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('')
  @ApiBody({
    type: FileUploadDto,
    description: 'File to upload',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    type: FileInfoRdo,
    description: 'Info about uploaded file',
  })
  @UseGuards(AuthAccessGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File, @ExtractUser() user: User) {
    const fileInfo = await this.fileService.writeFile(user.id, file);
    return fillObject(FileInfoRdo, fileInfo);
  }

  @Get(':id')
  @ApiOkResponse({
    type: FileInfoRdo,
    description: 'Info about file',
  })
  @ApiNotFoundResponse({
    description: 'File not found',
  })
  public async getFileInfo(@Param('id', MongoidValidationPipe) id: string) {
    const fileInfo = await this.fileService.findById(id);
    return fillObject(FileInfoRdo, fileInfo);
  }

  @Get('download/:id')
  @ApiOkResponse({
    description: 'Binary file',
  })
  @ApiNotFoundResponse({
    description: 'File not found',
  })
  async downloadFile(@Param('id', MongoidValidationPipe) id: string, @Res() res: Response) {
    const file = await this.fileService.findById(id);
    const filestream = await this.fileService.downloadFile(id);
    if (!filestream) {
      throw new HttpException('An error occurred while retrieving file', HttpStatus.EXPECTATION_FAILED);
    }

    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res);
  }

  @ApiNotFoundResponse({
    description: 'File not found',
  })
  @ApiOkResponse({
    description: 'File has been successfully deleted.',
  })
  @UseGuards(AuthAccessGuard)
  @Delete(':id')
  public async deleteFile(@Param('id', MongoidValidationPipe) fileId: string, @ExtractUser() user: User) {
    await this.fileService.deleteFile(user.id, fileId);
  }
}
