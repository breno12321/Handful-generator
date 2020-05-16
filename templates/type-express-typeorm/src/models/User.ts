import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import {
  IsNotEmpty, IsEmail, Length, Min, IsEmpty,
} from 'class-validator';
import bcrypt from 'bcrypt';

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
      unique: true,
    })
    @Length(2, 30, { message: 'The name must be at least 2 but not longer than 30 characters' })
    @IsNotEmpty({ message: 'The username is required' })
    username!: string;

    @Column()
    @Min(2)
    @IsEmail({}, { message: 'Incorrect email' })
    @IsNotEmpty({ message: 'The email is required' })
    email!: string;

    @Column()
    @IsNotEmpty()
    @IsNotEmpty({ message: 'The role is required' })
    role!: string;

    @Column()
    @IsNotEmpty({ message: 'The password is required' })
    password!: string;

    @Column({ nullable: true })
    token?: string;

    @CreateDateColumn()
    createAt!: Date;

    @UpdateDateColumn()
    updateAt!: Date;

    @VersionColumn()
    version!: number;

    hashPassword(): void {
      this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
