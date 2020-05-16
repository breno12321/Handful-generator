import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export default class Tokens {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  value!: string;

  @Column()
  revoked?: boolean;

  @CreateDateColumn()
  createAt!: Date;

  @UpdateDateColumn()
  updateAt!: Date;

  @VersionColumn()
  version!: number;
}
