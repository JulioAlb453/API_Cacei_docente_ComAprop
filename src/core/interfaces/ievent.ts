export interface IEvent{
    id: number;
    studentIds: number[]; 
    name: string;
    description: string;
    date: Date;
    category: string;
    location: string;
    status: string;
    start_time: Date;
    end_time: Date;
    created_at: Date;
    updated_at: Date;
}