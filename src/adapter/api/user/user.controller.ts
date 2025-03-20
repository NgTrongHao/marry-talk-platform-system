import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IUsersService } from '../../../application/user/users-service.interface';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';
import { BaseResponseDto } from '../../dto/base-response.dto';
import { RoleAuthoriseGuard } from '../../../infrastructure/security/guard/role-authorise.guard';
import { AuthorRole } from '../../../infrastructure/security/decorator/author-role.decorator';
import { Role } from '../../../core/domain/entity/enum/role.enum';
import { CreateMemberProfileRequestDto } from '../../dto/user/create-member-profile-request.dto';
import { CreateTherapistProfileRequestDto } from '../../dto/user/create-therapist-profile-request.dto';
import { TherapistInfoResponseDto } from '../../../application/user/service/dto/therapist-info-response.dto';
import { MemberInfoResponseDto } from '../../../application/user/service/dto/member-info-response.dto';
import { UserInfoResponseDto } from '../../../application/user/service/dto/user-info-response.dto';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(
    @Inject('IUsersService') private readonly userService: IUsersService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get My Profile REST API',
    description:
      'Get My Profile REST API is used to get the profile of the logged in user.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<
      UserInfoResponseDto | MemberInfoResponseDto | TherapistInfoResponseDto
    >,
  })
  async getMyProfile(@CurrentUser() info: TokenPayload) {
    return this.userService
      .getUserByUsername({ username: info.username })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-user-by-user-id/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get User By UserId REST API',
    description: 'Get User By UserId REST API is used to get user by userId.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({ type: BaseResponseDto<UserInfoResponseDto> })
  async getUserByUserId(@Param('userId') userId: string) {
    return this.userService
      .getUserProfileById(userId)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Post('create-member-profile')
  @UseGuards(JwtAuthGuard, RoleAuthoriseGuard)
  @AuthorRole(Role.REGISTRAR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Member Profile REST API',
    description:
      'Create Member Profile REST API is used for registrar to create member profile.',
  })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponseProperty({ type: BaseResponseDto<MemberInfoResponseDto> })
  async createMemberProfile(
    @CurrentUser() info: TokenPayload,
    @Body() request: CreateMemberProfileRequestDto,
  ) {
    return this.userService
      .createMemberProfile(info.username, request)
      .then((result) => new BaseResponseDto(201, result));
  }

  @Post('create-therapist-profile')
  @UseGuards(JwtAuthGuard, RoleAuthoriseGuard)
  @AuthorRole(Role.REGISTRAR)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Therapist Profile REST API',
    description:
      'Create Therapist Profile REST API is used for registrar to create therapist profile.',
  })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponseProperty({ type: BaseResponseDto<TherapistInfoResponseDto> })
  async createTherapistProfile(
    @CurrentUser() info: TokenPayload,
    @Body() request: CreateTherapistProfileRequestDto,
  ) {
    return this.userService
      .createTherapistProfile(info.username, request)
      .then((result) => new BaseResponseDto(201, result));
  }

  @Get('all')
  // @UseGuards(JwtAuthGuard, RoleAuthoriseGuard)
  // @AuthorRole(Role.REGISTRAR)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get All Users REST API',
    description: 'Get All Users REST API is used to get all users.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<{
      users: UserInfoResponseDto[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>,
  })
  async getAllUsers(
    @Query('page')
    page: number = 1,
    @Query('limit')
    limit: number = 10,
  ) {
    return this.userService
      .getAllUsers({ page, limit })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('count')
  @UseGuards(JwtAuthGuard, RoleAuthoriseGuard)
  @AuthorRole(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Count Total Users REST API',
    description: 'Count Total Users REST API is used to count total users.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({ type: BaseResponseDto<number> })
  async countTotalUsers() {
    return this.userService
      .countTotalUsers()
      .then((result) => new BaseResponseDto(200, result));
  }

  @Patch('update-member-profile')
  @UseGuards(JwtAuthGuard, RoleAuthoriseGuard)
  @AuthorRole(Role.MEMBER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Member Profile REST API',
    description:
      'Update Member Profile REST API is used for member to update their profile.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({ type: BaseResponseDto<MemberInfoResponseDto> })
  async updateMemberProfile(
    @CurrentUser() info: TokenPayload,
    @Body() request: CreateMemberProfileRequestDto,
  ) {
    return this.userService
      .updateMemberProfile(info.username, request)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Patch('update-therapist-profile')
  @UseGuards(JwtAuthGuard, RoleAuthoriseGuard)
  @AuthorRole(Role.THERAPIST)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Therapist Profile REST API',
    description:
      'Update Therapist Profile REST API is used for therapist to update their profile.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({ type: BaseResponseDto<TherapistInfoResponseDto> })
  async updateTherapistProfile(
    @CurrentUser() info: TokenPayload,
    @Body() request: CreateTherapistProfileRequestDto,
  ) {
    return this.userService
      .updateTherapistProfile(info.username, request)
      .then((result) => new BaseResponseDto(200, result));
  }
}
