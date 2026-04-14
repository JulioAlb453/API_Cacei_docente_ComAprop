export interface IStudentPerformance {
  student_id: number;
  performance: number;
  comments?: string;
  evaluated_at: Date;
}