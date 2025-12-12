import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "events" }) 
export class EventSchema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "teacher_id" })
  teacher_id!: number;

  @Column({ length: 200 })
  name!: string;

  @Column("text", { nullable: true })
  description!: string;

  @Column({ type: "date" })
  date!: Date;

  @Column({ length: 100, nullable: true })
  category!: string;

  @Column({ length: 200, nullable: true })
  location!: string;

  @Column({ length: 50, default: "scheduled" })
  status!: string;

  @Column({ type: "datetime", name: "start_time" })
  start_time!: Date;

  @Column({ type: "datetime", name: "end_time" })
  end_time!: Date;

  @Column({ length: 200, nullable: true })
  organizer!: string;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at!: Date;
}
