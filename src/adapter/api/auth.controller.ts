import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUserRequestDto } from '../dto/user/register-user-request.dto';
import { IAuthService } from '../../application/user/auth-service.interface';
import { LoginRequestDto } from '../dto/user/login-request.dto';
import { BaseResponseDto } from '../dto/base-response.dto';
import { CreateUserUsecaseResponse } from '../../application/user/service/usecase/register-user.usecase';
import { IFirebaseService } from '../../infrastructure/external/firebase/firebase-service.interface';
import { LoginFirebaseRequestDto } from '../dto/user/login-firebase-request.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
    @Inject('IFirebaseService')
    private readonly firebaseService: IFirebaseService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register REST API',
    description: 'Register REST API is used to register a new user.',
  })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponseProperty({
    type: BaseResponseDto<{
      user: CreateUserUsecaseResponse;
      accessToken: string;
    }>,
  })
  async register(@Body() request: RegisterUserRequestDto) {
    return this.authService
      .register(request)
      .then((result) => new BaseResponseDto(201, result));
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login REST API',
    description: 'Login REST API is used to login a user.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<{
      accessToken: string;
    }>,
  })
  async login(@Body() request: LoginRequestDto) {
    return this.authService
      .login(request)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Post('firebase-login')
  @ApiOperation({
    summary: 'Login with Firebase',
    description: `
      This API allows users to log in using a Firebase authentication token. 
      
      - If the user already exists, it returns an access token.
      - If the user does not exist and a username is provided, the user is registered and an access token is returned.
      - If the user does not exist and no username is provided, a 428 Precondition Required error is returned, requiring the user to submit a username.`,
  })
  @ApiBody({
    type: LoginFirebaseRequestDto,
    description:
      'Firebase authentication token and optional username for registration.',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully. Returns an access token.',
    schema: {
      example: {
        statusCode: 200,
        data: {
          accessToken: 'jwt-token',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description:
      'New user registered successfully. Returns user details and access token.',
    schema: {
      example: {
        statusCode: 201,
        data: {
          user: {
            id: 'user-id',
            email: 'user@example.com',
            username: 'exampleUser',
            firstName: 'John',
            lastName: 'Doe',
          },
          accessToken: 'jwt-token',
        },
      },
    },
  })
  @ApiResponse({
    status: 428,
    description: 'Username is required to register a new user.',
    schema: {
      example: {
        statusCode: 428,
        message: 'Username is required',
      },
    },
  })
  async firebaseLogin(@Body() request: LoginFirebaseRequestDto) {
    const result = await this.firebaseService.loginWithGoogle(request);

    if ('requiredUsername' in result && result.requiredUsername) {
      throw new HttpException(
        {
          statusCode: HttpStatus.PRECONDITION_REQUIRED, // 428
          message: 'Username is required',
        },
        HttpStatus.PRECONDITION_REQUIRED,
      );
    } else if ('user' in result) {
      return new BaseResponseDto(201, result);
    } else {
      return new BaseResponseDto(200, result);
    }
  }
}
