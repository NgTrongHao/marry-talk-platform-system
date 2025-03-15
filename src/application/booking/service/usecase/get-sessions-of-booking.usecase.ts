import { UseCase } from '../../../usecase.interface';
import { Session } from '../../../../core/domain/entity/session.entity';
import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';

@Injectable()
export class GetSessionsOfBookingUsecase implements UseCase<string, Session[]> {
  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(bookingId: string): Promise<Session[]> {
    return await this.sessionRepository.getSessionsByBookingId(bookingId);
  }
}
