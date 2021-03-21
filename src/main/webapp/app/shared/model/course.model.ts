export interface ICourse {
  id?: number;
  name?: string | null;
  point?: number | null;
  progress?: number | null;
  url?: string | null;
}

export const defaultValue: Readonly<ICourse> = {};
