import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFaucetTable1711805948933 implements MigrationInterface {
    name = 'CreateFaucetTable1711805948933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9bd2fe7a8e694de1c4ec2f666f"`);
        await queryRunner.query(`CREATE TABLE "faucet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from" character varying NOT NULL, "to" character varying NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, "txHash" character varying NOT NULL, "userId" character varying NOT NULL, "ip" character varying, "source" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_2b7ba275f2ff75b42c64b317ded" UNIQUE ("txHash"), CONSTRAINT "PK_30dd77a5c903913146a359d2a4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_63f26ee16eb993043781c5ffab" ON "faucet" ("from") `);
        await queryRunner.query(`CREATE INDEX "IDX_2c9d7515456e2e97d75e59e6c1" ON "faucet" ("to") `);
        await queryRunner.query(`CREATE INDEX "IDX_2b7ba275f2ff75b42c64b317de" ON "faucet" ("txHash") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_from_to_currency" ON "faucet" ("from", "to", "currency") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "telegramUid" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_3122b4b8709577da50e89b6898" ON "user" ("address") `);
        await queryRunner.query(`CREATE INDEX "IDX_9d392ded93460deb16383a5a30" ON "user" ("telegramUid") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_9d392ded93460deb16383a5a30"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3122b4b8709577da50e89b6898"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telegramUid"`);
        await queryRunner.query(`DROP INDEX "public"."idx_from_to_currency"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b7ba275f2ff75b42c64b317de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c9d7515456e2e97d75e59e6c1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_63f26ee16eb993043781c5ffab"`);
        await queryRunner.query(`DROP TABLE "faucet"`);
        await queryRunner.query(`CREATE INDEX "IDX_9bd2fe7a8e694de1c4ec2f666f" ON "user" ("address") `);
    }

}
