export interface IEvent_report{
    id: number;
    event_id: number;
    student_id: number;
    teacher_id: number;
    name: string;
    start_period: Date;
    end_period: Date;
    date: Date;
    format: string;
}