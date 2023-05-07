import { Body, Controller, HttpCode, Get, HttpException, HttpStatus, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import 'multer';
import { FileService } from './file.service';
import { fillObject } from '@project/util/util-core';
import { FileInfoRdo } from '../rdo/file-info.rdo';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from '../dto/upload-file.dto';
import { MongoidValidationPipe } from '@project/shared/shared-pipes';
import { DeleteFileDto } from '../dto/delete-file.dto';

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('')
  @ApiBody({
    type: UploadFileDto,
    description: 'File to upload',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    type: FileInfoRdo,
    description: 'Info about uploaded file',
  })
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadFileDto) {
    const fileInfo = await this.fileService.writeFile(file, dto.ownerId);
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

  @ApiBody({
    type: DeleteFileDto,
    description: 'File to upload',
  })
  @ApiNotFoundResponse({
    description: 'File not found',
  })
  @ApiBadRequestResponse({
    description: 'Owner id is not valid',
  })
  @ApiOkResponse({
    description: 'File has been successfully deleted.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('delete')
  public async deleteFile(@Body() dto: DeleteFileDto) {
    await this.fileService.deleteFile(dto.fileId, dto.ownerId);
  }
}
