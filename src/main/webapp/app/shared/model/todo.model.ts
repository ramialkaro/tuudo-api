import dayjs from 'dayjs';
import { ICourse } from 'app/shared/model/course.model';
import { ISchool } from 'app/shared/model/school.model';
import { Status } from 'app/shared/model/enumerations/status.model';
import { Priority } from 'app/shared/model/enumerations/priority.model';

export interface ITodo {
  id?: number;
  title?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  description?: string | null;
  status?: Status | null;
  priority?: Priority | null;
  course?: ICourse | null;
  school?: ISchool | null;
}

export const defaultValue: Readonly<ITodo> = {};
