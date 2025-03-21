export enum Role {
  REGISTRAR = 'REGISTRAR',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  THERAPIST = 'THERAPIST',
}

export function valueOfRole(role: string): Role {
  if (Object.values(Role).includes(role as Role)) {
    return role as Role;
  }
  throw new Error(`Invalid role: ${role}`);
}
