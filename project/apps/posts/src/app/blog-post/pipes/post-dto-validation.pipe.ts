import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BlogPostDtoGeneric, ImagePostDto, LinkPostDto, QuotePostDto, TextPostDto, VideoPostDto } from '../dto';
import { PostTypeEnum } from '@project/shared/app-types';
import { ValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';

const EXPECTED_ARGUMENT_TYPE = 'body';

@Injectable()
export class PostDtoValidationPipe implements PipeTransform {
  public async transform(value: BlogPostDtoGeneric<PostTypeEnum>, { type }: ArgumentMetadata) {
    if (type !== EXPECTED_ARGUMENT_TYPE) {
      throw new Error('This pipe must used only body params!');
    }

    const errors = await this.validate(value);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return value;
  }

  private async validate(value: BlogPostDtoGeneric<PostTypeEnum>) {
    const validationOptions: ValidatorOptions = {
      whitelist: true,
    };

    switch (value.type) {
      case PostTypeEnum.IMAGE:
        return validate(plainToInstance(ImagePostDto, value), validationOptions);
      case PostTypeEnum.LINK:
        return validate(plainToInstance(LinkPostDto, value), validationOptions);
      case PostTypeEnum.QUOTE:
        return validate(plainToInstance(QuotePostDto, value), validationOptions);
      case PostTypeEnum.TEXT:
        return validate(plainToInstance(TextPostDto, value), validationOptions);
      case PostTypeEnum.VIDEO:
        return validate(plainToInstance(VideoPostDto, value), validationOptions);
      default:
        throw new BadRequestException('Unknown post type!');
    }
  }
}
