import { RealDepartment } from '@/shared/types/railsyncReal';

export type UserRole = RealDepartment | 'CONTROLLER';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  department?: RealDepartment;
}
