import { SetMetadata } from '@nestjs/common';

export const ROLE_ENABLED_KEY = 'role_enabled';
export const RequireRoleEnabled = () => SetMetadata(ROLE_ENABLED_KEY, true);
