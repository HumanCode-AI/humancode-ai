import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHumanCodeUsersTable1711558281330
  implements MigrationInterface
{
  name = 'CreateHumanCodeUsersTable1711558281330';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "humancode_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "humanCode" character varying NOT NULL, "address" character varying, "description" character varying, "regIp" character varying, "lastLoginIp" character varying, "lastLoginTime" TIMESTAMP, "source" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "statusId" integer, CONSTRAINT "PK_3ee6b3694950ed07750db641e53" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_430c79e1933fab88b314a5aad3" ON "humancode_users" ("humanCode") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67870e743b3f80642a07c1dd7d" ON "humancode_users" ("address") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_hc_and_addr" ON "humancode_users" ("humanCode", "address") `,
    );
    await queryRunner.query(
      `ALTER TABLE "humancode_users" ADD CONSTRAINT "FK_3a4ed4b5f7165b3aaa26a4a1915" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "humancode_users" DROP CONSTRAINT "FK_3a4ed4b5f7165b3aaa26a4a1915"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_hc_and_addr"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_67870e743b3f80642a07c1dd7d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_430c79e1933fab88b314a5aad3"`,
    );
    await queryRunner.query(`DROP TABLE "humancode_users"`);
  }
}
