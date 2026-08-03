import {
  type ArgumentMetadata,
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { ReadStream } from 'node:fs';

import {
  FILE_SUPPORTED_FORMAT_LIST,
  MAX_FILE_SIZE_LIMIT,
} from '@/src/shared/constants/constants';
import {
  validateFileFormat,
  validateFileSize,
} from '@/src/shared/utils/file/file.util';

interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  public async transform(
    value: FileUpload,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _metadata: ArgumentMetadata
  ): Promise<FileUpload> {
    if (!value?.filename) {
      throw new BadRequestException('File was not uploaded');
    }

    const { filename, createReadStream } = value;

    const fileStream = createReadStream();

    const isFileFormatValid = validateFileFormat(
      filename,
      FILE_SUPPORTED_FORMAT_LIST
    );

    if (!isFileFormatValid) {
      throw new BadRequestException('File format is not supported');
    }

    const isFileSizeValid = await validateFileSize(
      fileStream,
      MAX_FILE_SIZE_LIMIT
    );

    if (!isFileSizeValid) {
      throw new BadRequestException('File weight bigger than 10MB');
    }

    return value;
  }
}
