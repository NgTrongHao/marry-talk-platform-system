import { Member } from '../entity/member.entity';

export interface MemberRepository {
  saveMemberProfile(member: Member): Promise<Member>;

  getMemberProfileByUsername(username: string): Promise<Member | null>;
}
