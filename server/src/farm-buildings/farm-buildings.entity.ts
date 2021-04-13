import { IsString } from 'class-validator';
import { FarmUnit } from 'src/farm-units/farm-units.entity';
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FarmBuilding extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @IsString()
    name: string;

    @Column()
    @IsString()
    unitType: string;

    @OneToMany(() => FarmUnit, (farmUnit) => farmUnit.farmBuilding, {
        eager: true,
    })
    farmUnits: FarmUnit[];
}
