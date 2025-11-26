import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "events" }) 
export class EventSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("text")
  description!: string;

  @Column()
  date!: Date;

  @Column()
  category!: string;

  @Column()
  location!: string;

  @Column({ default: "scheduled" })
  status!: string;

  @Column()
  start_time!: Date;

  @Column()
  end_time!: Date;

  @Column()
  teacher_id!: number; 

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column("simple-json", { nullable: true })
  studentIds!: number[];
}