import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, Max, Min } from 'class-validator';

export class RatingBookingRequestDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Max(5)
  @Min(1)
  rating: number;
}
