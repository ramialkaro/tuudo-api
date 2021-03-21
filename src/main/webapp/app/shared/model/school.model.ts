export interface ISchool {
  id?: number;
  name?: string | null;
  url?: string | null;
}

export const defaultValue: Readonly<ISchool> = {};
