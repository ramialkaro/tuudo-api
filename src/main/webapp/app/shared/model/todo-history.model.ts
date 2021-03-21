import dayjs from 'dayjs';
import { ITodo } from 'app/shared/model/todo.model';

export interface ITodoHistory {
  id?: number;
  startAt?: string | null;
  endAt?: string | null;
  todo?: ITodo | null;
}

export const defaultValue: Readonly<ITodoHistory> = {};
