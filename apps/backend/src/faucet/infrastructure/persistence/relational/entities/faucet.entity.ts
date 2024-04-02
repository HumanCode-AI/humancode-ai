import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
  
  @Entity('faucet')
  // @Index('idx_from_to_currency', ['from', 'to', 'currency'], { unique: true })
  export class FaucetEntity extends EntityRelationalHelper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ nullable: false })
    from: string;

    @Index()
    @Column({ nullable: false })
    to: string;

    @Column({ nullable: false })
    amount: number;

    // 币种 coinCode
    @Column({ nullable: false })
    currency: string;

    // 交易hash
    @Index()
    @Column({ nullable: false, unique: true })
    txHash: string;

    @Column({ nullable: false })
    userId: string;
    
    @Column({ nullable: true })
    ip?: string;
  
    @Column({ nullable: true })
    source?: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }
  