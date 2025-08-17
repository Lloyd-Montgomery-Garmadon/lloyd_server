import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'user_sessions' })
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 512 })
  token: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  device_info?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip?: string;

  @Column({ name: 'created_at', type: 'bigint', nullable: false })
  created_at: number; // 时间戳

  @Column({ name: 'expires_at', type: 'bigint', nullable: true })
  expires_at: number;
}
