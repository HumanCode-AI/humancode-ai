import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveidxFromToCurrency1711967422467 implements MigrationInterface {
    name = 'RemoveidxFromToCurrency1711967422467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_from_to_currency"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_from_to_currency" ON "faucet" ("from", "to", "currency") `);
    }

}
