import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToUser1786378142075 implements MigrationInterface {
    name = 'AddEmailToUser1786378142075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "email" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email"`);
    }

}
