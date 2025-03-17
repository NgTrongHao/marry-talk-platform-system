import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IUsersService } from '../users-service.interface';
import {
  GetUserByUsernameUsecase,
  GetUserUseCaseCommand,
} from './usecase/get-user-by-username.usecase';
import {
  GetUserByIdUsecase,
  GetUserByIdUsecaseCommand,
} from './usecase/get-user-by-id.usecase';
import { UserInfoResponseDto } from './dto/user-info-response.dto';
import { GetAllUsersUsecase } from './usecase/get-all-users.usecase';
import { CountTotalUsersUsecase } from './usecase/count-total-users.usecase';
import { CreateMemberProfileUsecase } from './usecase/create-member-profile.usecase';
import { MemberInfoResponseDto } from './dto/member-info-response.dto';
import { User } from '../../../core/domain/entity/user.entity';
import { Member } from '../../../core/domain/entity/member.entity';
import { CreateTherapistProfileUsecase } from './usecase/create-therapist-profile.usecase';
import { TherapistInfoResponseDto } from './dto/therapist-info-response.dto';
import { Therapist } from '../../../core/domain/entity/therapist.entity';
import { CheckDuplicateUserUsecase } from './usecase/check-duplicate-user.usecase';
import {
  GetUserByEmailUsecase,
  GetUserByEmailUsecaseCommand,
} from './usecase/get-user-by-email.usecase';
import { UsecaseHandler } from '../../usecase-handler.service';
import { ITherapyManagementService } from '../../therapy-management/therapy-management-service.interface';
import { TherapistTypeInfoResponseDto } from './dto/therapist-type-info-response.dto';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    private useCaseHandler: UsecaseHandler,
    @Inject('ITherapyManagementService')
    private therapyManagementService: ITherapyManagementService,
  ) {}

  async getUserByUsername(request: GetUserUseCaseCommand) {
    const user = await this.useCaseHandler.execute(
      GetUserByUsernameUsecase,
      request,
    );
    switch (user.constructor.name) {
      case 'Registrar':
        return new UserInfoResponseDto(user as User);
      case 'Member':
        return new MemberInfoResponseDto(user as Member);
      case 'Therapist': {
        const therapistTypes = await Promise.all(
          (user as Therapist).therapistTypes.map(async (type) => {
            const therapy =
              await this.therapyManagementService.getTherapyCategoryById({
                id: type.therapyCategoryId,
              });
            return new TherapistTypeInfoResponseDto(therapy, type.enable);
          }),
        );
        return new TherapistInfoResponseDto(user as Therapist, therapistTypes);
      }
      default:
        return new UserInfoResponseDto(user as User);
    }
  }

  async getUserByEmail(request: GetUserByEmailUsecaseCommand) {
    return await this.useCaseHandler.execute(GetUserByEmailUsecase, request);
  }

  async existsUser({ username, email }: { username?: string; email?: string }) {
    return this.useCaseHandler.execute(CheckDuplicateUserUsecase, {
      username,
      email,
    });
  }

  async getUserById(
    request: GetUserByIdUsecaseCommand,
  ): Promise<UserInfoResponseDto> {
    const user = await this.useCaseHandler.execute(GetUserByIdUsecase, request);
    return new UserInfoResponseDto(user);
  }

  async getAllUsers({ page, limit }: { page: number; limit: number }): Promise<{
    users: UserInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const take = Number(limit);

    // Use Promise.all to execute multiple promises concurrently
    const [total, users] = await Promise.all([
      this.useCaseHandler.execute(CountTotalUsersUsecase),
      this.useCaseHandler.execute(GetAllUsersUsecase, { skip, take }),
    ]);

    return {
      users: users.map((user) => new UserInfoResponseDto(user)),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async countTotalUsers(): Promise<number> {
    return this.useCaseHandler.execute(CountTotalUsersUsecase);
  }

  async createMemberProfile(
    username: string,
    request: {
      birthdate?: Date;
      phoneNumber?: string;
      avatarImageURL?: string;
    },
  ): Promise<MemberInfoResponseDto> {
    const member = await this.useCaseHandler.execute(
      CreateMemberProfileUsecase,
      {
        username,
        additionalInfo: request,
      },
    );

    if (!member) {
      throw new ConflictException('Member creation failed');
    }

    return new MemberInfoResponseDto(member);
  }

  async createTherapistProfile(
    username: string,
    request: {
      birthdate?: Date;
      phoneNumber?: string;
      avatarImageURL?: string;
      bio?: string;
      expertCertificates: string[];
      professionalExperience?: string;
    },
  ): Promise<TherapistInfoResponseDto> {
    const therapist = await this.useCaseHandler.execute(
      CreateTherapistProfileUsecase,
      {
        username,
        additionalInfo: request,
      },
    );

    if (!therapist) {
      throw new ConflictException('Therapist creation failed');
    }

    const therapistTypes = await Promise.all(
      therapist.therapistTypes.map(async (type) => {
        const therapy =
          await this.therapyManagementService.getTherapyCategoryById({
            id: type.therapyCategoryId,
          });
        return new TherapistTypeInfoResponseDto(therapy, type.enable);
      }),
    );

    return new TherapistInfoResponseDto(therapist, therapistTypes);
  }

  async getUserProfileById(
    userId: string,
  ): Promise<
    UserInfoResponseDto | MemberInfoResponseDto | TherapistInfoResponseDto
  > {
    const user = await this.useCaseHandler.execute(GetUserByIdUsecase, {
      userId,
    });
    return this.getUserByUsername({ username: user.username });
  }
}
