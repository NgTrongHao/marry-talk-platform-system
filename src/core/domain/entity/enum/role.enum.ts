export enum Role {
  REGISTRAR = 'registrar',
  ADMIN = 'admin',
  MEMBER = 'member',
  THERAPIST = 'therapist',
}

export function valueOfRole(role: string): Role {
  if (Object.values(Role).includes(role as Role)) {
    return role as Role;
  }
  throw new Error(`Invalid role: ${role}`);
}
