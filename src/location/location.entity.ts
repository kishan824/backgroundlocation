// location.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;

  @CreateDateColumn()
  createdAt: Date;
}
