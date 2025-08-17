import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  bucket_name: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'bigint', default: 0 })
  storage_used: number;

  @Column({ type: 'bigint', default: 10 * 1024 * 1024 * 1024 })
  storage_total: number;

  @Column({ type: 'boolean', default: false })
  two_fa_enabled: boolean;

  @Column({ name: 'created_at', type: 'bigint' })
  created_at: number; // 时间戳

  @Column({ name: 'updated_at', type: 'bigint' })
  updated_at: number; // 时间戳
}
