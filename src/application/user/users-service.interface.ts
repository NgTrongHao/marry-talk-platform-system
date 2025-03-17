import { GetUserUseCaseCommand } from './service/usecase/get-user-by-username.usecase';
import { GetUserByIdUsecaseCommand } from './service/usecase/get-user-by-id.usecase';
import { UserInfoResponseDto } from './service/dto/user-info-response.dto';
import { MemberInfoResponseDto } from './service/dto/member-info-response.dto';
import { TherapistInfoResponseDto } from './service/dto/therapist-info-response.dto';
import { GetUserByEmailUsecaseCommand } from './service/usecase/get-user-by-email.usecase';
import { User } from '../../core/domain/entity/user.entity';

export interface IUsersService {
  /**
   * Get user by username
   * @param {GetUserUseCaseCommand} request
   * @memberof IUsersService
   * @implementsBy UsersService
   * @author NgTrongHao
   */
  getUserByUsername(
    request: GetUserUseCaseCommand,
  ): Promise<
    UserInfoResponseDto | MemberInfoResponseDto | TherapistInfoResponseDto
  >;

  getUserByEmail(request: GetUserByEmailUsecaseCommand): Promise<User>;

  existsUser({
    username,
    email,
  }: {
    username?: string;
    email?: string;
  }): Promise<boolean>;

  getUserProfileById(
    userId: string,
  ): Promise<
    UserInfoResponseDto | MemberInfoResponseDto | TherapistInfoResponseDto
  >;

  /**
   * Get user by id
   * @param {GetUserByIdUsecaseCommand} request
   * @returns {Promise<UserInfoResponseDto>}
   * @memberof IUsersService
   * @implementsBy UsersService
   * @author NgTrongHao
   */
  getUserById(request: GetUserByIdUsecaseCommand): Promise<UserInfoResponseDto>;

  /**
   * Get all users
   * @param {number} param.page
   * @param {number} param.limit
   * @returns {Promise<{users: UserInfoResponseDto[]; page: number; limit: number; total: number; totalPages: number}>}
   * @memberof IUsersService
   * @implementsBy UsersService
   * @author NgTrongHao
   */
  getAllUsers(param: { page: number; limit: number }): Promise<{
    users: UserInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>;

  /**
   * Count total users
   * @returns {Promise<number>}
   * @memberof IUsersService
   * @implementsBy UsersService
   * @author NgTrongHao
   */
  countTotalUsers(): Promise<number>;

  /**
   * Create member profile
   * @param {string} username
   * @param {{birthdate?: Date; phoneNumber?: string; avatarImageURL?: string}} request
   * @returns {Promise<MemberInfoResponseDto>}
   * @memberof IUsersService
   * @implementsBy UsersService
   */
  createMemberProfile(
    username: string,
    request: {
      birthdate?: Date;
      phoneNumber?: string;
      avatarImageURL?: string;
    },
  ): Promise<MemberInfoResponseDto>;

  /**
   * Create therapist-management profile
   * @param {string} username
   * @param {{
   *       birthdate?: Date;
   *       phoneNumber?: string;
   *       avatarImageURL?: string;
   *       bio?: string;
   *       expertCertificates: string[];
   *       professionalExperience?: string;
   *       therapistTypes: string[];
   *     }} request
   * @returns {Promise<TherapistInfoResponseDto>}
   * @memberof IUsersService
   * @implementsBy UsersService
   * @author NgTrongHao
   * */
  createTherapistProfile(
    username: string,
    request: {
      birthdate?: Date;
      phoneNumber?: string;
      avatarImageURL?: string;
      bio?: string;
      expertCertificates: string[];
      professionalExperience?: string;
      therapistTypes: string[];
    },
  ): Promise<TherapistInfoResponseDto>;
}
