// import {
//   Body,
//   Controller,
//   Get,
//   Post,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
//
// import { FileInterceptor } from '@nestjs/platform-express';
// import { logger } from '@mikro-orm/nestjs';
// import {
//   completeMultipartUpload,
//   createClient,
//   createMultipartUpload,
//   Env,
//   getGetObjectPresignedUrl,
//   getPartSignedUrl,
//   getPutObjectPresignedUrl,
//   uploadMultipartBuffer,
//   uploadPart,
// } from 'lloyd_core';
// import { IsString } from 'class-validator';
//
// const env = new Env('../../config/oss.json');
//
// const client = createClient({
//   endpoint: env.get('localOSSAddress'),
//   region: env.get('region'),
//   accessKey: env.get('accessKey'),
//   secretKey: env.get('secretKey'),
//   forcePathStyle: env.getBoolean('forcePathStyle'),
//   connectionTimeout: env.getNumber('connectionTimeout'),
//   requestTimeout: env.getNumber('requestTimeout'),
// });
//
// export class UploadDto {
//   @IsString()
//   bucket: string;
//
//   @IsString()
//   key: string;
// }
//
// @Controller('file') // 路由前缀 /file
// export class FileController {
//   @Get('getDownloadUrl') // GET /hello
//   async getDownloadUrl(): Promise<string> {
//     return await getGetObjectPresignedUrl({
//       client: client,
//       bucket: 'test-bucket',
//       key: 'test.json',
//     });
//   }
//
//   @Post('getUploadUrl')
//   async getUploadUrl(@Body() body: UploadDto): Promise<string> {
//     return await getPutObjectPresignedUrl({
//       client: client,
//       bucket: body.bucket,
//       key: body.key,
//     });
//   }
//
//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file: Express.Multer.File) {
//     logger.debug(file);
//     await uploadMultipartBuffer({
//       fileData: file.buffer,
//       client: client,
//       bucket: 'test-bucket',
//       key: file.originalname,
//     });
//   }
//
//   @Post('create')
//   async createMultipart(@Body() body: { bucket: string; key: string }) {
//     const res = await createMultipartUpload({
//       client: client,
//       bucket: body.bucket,
//       key: body.key,
//     });
//     return { uploadId: res.UploadId };
//   }
//
//   @Post('getPartUrl')
//   async getPartUrl(
//     @Body()
//     body: {
//       bucket: string;
//       key: string;
//       uploadId: string;
//       partNumber: number;
//     },
//   ) {
//     // 调用核心库方法，returnCommand 为 true 获取 UploadPartCommand
//     const command = await uploadPart({
//       client: client,
//       bucket: body.bucket,
//       key: body.key,
//       uploadId: body.uploadId,
//       partNumber: body.partNumber,
//       returnCommand: true, // 关键
//     });
//
//     // 生成分片上传的预签名 URL
//     const url = await getPartSignedUrl({
//       client: client,
//       command: command,
//       expiresIn: 600, // 可选
//     });
//
//     return { url };
//   }
//
//   @Post('complete')
//   async completeMultipart(
//     @Body()
//     body: {
//       bucket: string;
//       key: string;
//       uploadId: string;
//       parts: { ETag: string; PartNumber: number }[];
//     },
//   ) {
//     const res = await completeMultipartUpload({
//       client: client,
//       bucket: body.bucket,
//       key: body.key,
//       uploadId: body.uploadId,
//       parts: body.parts,
//     });
//     logger.debug('completeMultipartUpload', res);
//     return { success: true };
//   }
// }
