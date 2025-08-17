import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Bucket } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createBucket, createClient, Env } from 'lloyd_core';
import { TimeUtil } from 'lloyd_core';

const env = new Env('../../../config/oss.json');

const client = createClient({
  endpoint: env.get('localOSSAddress'),
  region: env.get('region'),
  accessKey: env.get('accessKey'),
  secretKey: env.get('secretKey'),
  forcePathStyle: env.getBoolean('forcePathStyle'),
  connectionTimeout: env.getNumber('connectionTimeout'),
  requestTimeout: env.getNumber('requestTimeout'),
});

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Bucket)
    private readonly bucketRepo: Repository<Bucket>,
  ) {}

  /**
   * 创建一个新的 Bucket
   * @param name bucket 名称
   * @param owner 用户实体
   * @returns 创建好的 Bucket
   */
  async createBucket(name: string, owner: User): Promise<Bucket> {
    const bucket = this.bucketRepo.create({
      name: name,
      owner: owner,
      created_at: TimeUtil.getTimestamp(),
      updated_at: TimeUtil.getTimestamp(),
    });
    await createBucket(client, name);
    return this.bucketRepo.save(bucket);
  }
}
