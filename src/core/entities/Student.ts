

import { IStudent } from "../interfaces/istudent";

export class Student implements IStudent {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public tuition: number,
    public grade: number,
    public group: string,
    public status: string
  ) {}

  
}