export class FirebaseUserEntity {
  constructor(
    public uid: string,
    public email: string,
    public displayName: string,
    public photoURL?: string,
  ) {}
}
