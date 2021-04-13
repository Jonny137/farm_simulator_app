import {
    IsDate,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { FarmBuilding } from 'src/farm-buildings/farm-buildings.entity';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FarmUnit extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsString()
    type: string;

    @Column()
    @MinLength(0)
    @MaxLength(100)
    @IsNumber()
    health: number;

    @Column({ default: null, nullable: true })
    @IsDate()
    lastFed: Date;

    @Column({ default: null, nullable: true })
    @IsDate()
    feedingInterval: Date;

    @ManyToOne(() => FarmBuilding, (farm) => farm.farmUnits, {
        eager: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'farmBuildingId', referencedColumnName: 'id' }])
    farmBuilding: FarmBuilding;

    @Column({ nullable: true })
    farmBuildingId: string;
}
