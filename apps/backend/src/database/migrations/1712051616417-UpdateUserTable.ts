import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1712051616417 implements MigrationInterface {
    name = 'UpdateUserTable1712051616417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "humancodeTime" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "humancodeTime"`);
    }

}
