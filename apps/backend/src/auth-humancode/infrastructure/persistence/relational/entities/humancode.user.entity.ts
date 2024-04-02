import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { StatusEntity } from 'src/statuses/infrastructure/persistence/relational/entities/status.entity';

@Entity('humancode_users')
@Index('idx_hc_and_addr', ['humanCode', 'address'], { unique: false })
export class HumancodeUserEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ nullable: false, unique: false })
  humanCode: string;
  /**
   * wallet address
   */
  @Index()
  @Column({ nullable: true, unique: false })
  address?: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;

  @Column({ nullable: true })
  regIp?: string;

  @Column({ nullable: true })
  lastLoginIp?: string;

  @Column({ nullable: true })
  lastLoginTime?: Date;

  @Column({ nullable: true })
  source?: string;

  @CreateDateColumn()
  createdAt: Date;
  /**
   * bind wallet address at
   */
  bindAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
