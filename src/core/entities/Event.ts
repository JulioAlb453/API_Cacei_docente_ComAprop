import { IEvent } from "../interfaces/ievent";
export class Event implements IEvent {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public date: Date,
    public category: string,
    public location: string,
    public status: string,
    public start_time: Date,
    public end_time: Date,
    public created_at: Date,
    public updated_at: Date,
    public studentIds: number[] = []
  ) {}

  update(updates: Partial<Event>): Event {
    return new Event(
      this.id,
      updates.name || this.name,
      updates.description || this.description,
      updates.date || this.date,
      updates.category || this.category,
      updates.location || this.location,
      updates.status || this.status,
      updates.start_time || this.start_time,
      updates.end_time || this.end_time,
      updates.created_at || this.created_at,
      updates.updated_at || this.updated_at,
      updates.studentIds || this.studentIds
    );
  }

  cancel(): void {
    this.status = "cancelled";
    this.updated_at = new Date();
  }

  complete(): void {
    this.status = "completed";
    this.updated_at = new Date();
  }

  isUpcoming(): boolean {
    return this.date > new Date() && this.status === "scheduled";
  }

  isPast(): boolean {
    return this.date <= new Date();
  }

  removeStudent(studentId: number): void {
    this.studentIds = this.studentIds.filter((id) => id !== studentId);
    this.updated_at = new Date();
  }

  getStudentCount(): number {
    return this.studentIds.length;
  }
}
