export interface Candidate {
  name: string;
  surname: string;
  seniority: 'junior' | 'senior' | 'mid';
  yearsOfExperience: number;
  availability: boolean;
}