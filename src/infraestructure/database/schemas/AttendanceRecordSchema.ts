import { EntitySchema } from "typeorm";
import { Attendance_record } from "../../../core/entities/Attendance_record";

export const AttendanceRecordSchema = new EntitySchema<Attendance_record>({
  name: "Attendance_record",
  tableName: "attendance_records",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    student_id: {
      type: Number,
      nullable: false,
    },
    event_id: {
      type: Number,
      nullable: false,
    },
    date: {
      type: "datetime",
      nullable: false,
    },
    status: {
      type: "enum",
      enum: ["present", "absent", "justified", "late"],
      default: "absent",
    },
    observations: {
      type: "text",
      nullable: true,
    },
    register_by: {
      type: String,
      length: 255,
      nullable: false,
    },
    arrival_time: {
      type: "datetime",
      nullable: true,
    },
    departure_time: {
      type: "datetime",
      nullable: true,
    },
    justification_type: {
      type: String,
      length: 100,
      nullable: true,
    },
    evidence_urls: {
      type: "text",
      nullable: true,
    },
    created_at: {
      type: "datetime",
      createDate: true,
    },
    updated_at: {
      type: "datetime",
      updateDate: true,
    },
  },
  indices: [
    {
      name: "IDX_ATTENDANCE_STUDENT",
      columns: ["student_id"],
    },
    {
      name: "IDX_ATTENDANCE_EVENT",
      columns: ["event_id"],
    },
    {
      name: "IDX_ATTENDANCE_DATE",
      columns: ["date"],
    },
    {
      name: "IDX_ATTENDANCE_STATUS",
      columns: ["status"],
    },
  ],
});

