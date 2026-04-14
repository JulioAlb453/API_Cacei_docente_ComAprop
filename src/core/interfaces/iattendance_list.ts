export interface IAttendance_list{
    id: number;
    student_id: number[];
    teacher_id: number;
    event_id: number;
    date: Date;
    status: string;
    observations: string;
    register_by: string;
    evidences: string[];
    created_at: Date;
    updated_at: Date;
}