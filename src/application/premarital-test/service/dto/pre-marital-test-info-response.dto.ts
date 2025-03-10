import { ApiProperty } from '@nestjs/swagger';
import { TherapyInfoResponseDto } from '../../../therapy-management/service/dto/therapy-info-response.dto';
import { PremaritalTest } from '../../../../core/domain/entity/pre-marital-test.entity';

export class PreMaritalTestInfoResponseDto {
  @ApiProperty()
  testId: string;

  @ApiProperty()
  testName: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  therapyCategories: TherapyInfoResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(
    premaritalTest: PremaritalTest,
    therapies: TherapyInfoResponseDto[],
  ) {
    this.testId = premaritalTest.id!;
    this.testName = premaritalTest.name;
    this.description = premaritalTest.description;
    this.therapyCategories = therapies;
    this.createdAt = premaritalTest.createdAt!;
    this.updatedAt = premaritalTest.updatedAt!;
  }
}
