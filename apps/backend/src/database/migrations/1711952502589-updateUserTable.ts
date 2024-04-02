import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1711952502589 implements MigrationInterface {
    name = 'UpdateUserTable1711952502589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "humancode" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_b3b558246519c75f6dcfd61216" ON "user" ("humancode") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b3b558246519c75f6dcfd61216"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "humancode"`);
    }

}
