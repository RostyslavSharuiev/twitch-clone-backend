import { ReadStream } from 'node:fs';

export function validateFileFormat(
  filename: string,
  allowedFileFormatList: string[]
) {
  const fileParts = filename.split('.');
  const extension = fileParts.at(-1);

  if (!extension) throw new Error('File must be with extension');

  return allowedFileFormatList.includes(extension);
}

export async function validateFileSize(
  fileStream: ReadStream,
  allowedFileSizeInBytes: number
) {
  return new Promise((resolve, reject) => {
    let fileSizeInBytes = 0;

    fileStream
      .on('data', (data: Buffer | string) => {
        if (typeof data === 'string') {
          fileSizeInBytes += Buffer.byteLength(data);
        } else {
          fileSizeInBytes += data.byteLength;
        }
      })
      .on('end', () => {
        resolve(fileSizeInBytes <= allowedFileSizeInBytes);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
