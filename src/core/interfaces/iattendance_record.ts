export interface IAttendance_record{
    id: number;
    student_id: number;
    event_id: number;
    date: Date;
    status: string;
    observations: string;
    register_by: string;
    created_at: Date;
    updated_at: Date;
}