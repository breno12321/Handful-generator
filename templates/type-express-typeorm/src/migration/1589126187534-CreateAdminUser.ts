/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner } from 'typeorm';
import User from '../models/User';

export default class CreateAdminUser1589126187534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const user = new User();
    user.username = 'admin';
    user.password = 'admin';
    user.email = 'admin@admin.com';
    user.hashPassword();
    user.role = 'ADMIN';
    const userRepository = queryRunner.connection.getRepository(User);
    await userRepository.save(user);
  }

  public async down(_queryRunner: QueryRunner): Promise<any> {
    return 0;
  }
}
