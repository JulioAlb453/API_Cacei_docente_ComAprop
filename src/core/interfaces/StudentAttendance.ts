
export type AttendanceStatus = 'present' | 'absent' | 'justified' | 'pending';

export interface StudentAttendance {
  studentId: number;
  status: AttendanceStatus;
  markedAt: Date;
  justification?: string;
}