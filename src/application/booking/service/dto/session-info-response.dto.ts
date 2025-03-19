import { BookingInfoResponseDto } from './booking-info-response.dto';
import { Session } from '../../../../core/domain/entity/session.entity';

export class SessionInfoResponseDto {
  id: string;
  sessionNumber: number;
  progressStatus: string;
  sessionDate: Date;
  meetingUrl: string;
  booking: BookingInfoResponseDto;
  startTime: string;
  endTime: string;
  reported: boolean;

  constructor(session: Session, booking: BookingInfoResponseDto) {
    this.id = session.id!;
    this.sessionNumber = session.sessionNumber;
    this.progressStatus = session.progressStatus;
    this.sessionDate = session.sessionDate;
    this.meetingUrl = session.meetingUrl;
    this.booking = booking;
    this.startTime = session.startTime;
    this.endTime = session.endTime;
    this.reported = session.reported;
  }
}
