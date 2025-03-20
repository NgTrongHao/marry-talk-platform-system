import { Session } from '../entity/session.entity';
import { ProgressStatus } from '../entity/enum/progress-status.enum';

export interface SessionRepository {
  save(session: Session): Promise<Session>;

  getSessionsByBookingId(bookingId: string): Promise<Session[]>;

  findByTherapistAndDate(
    therapistId: string,
    status: ProgressStatus | undefined,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<Session[]>;

  findSessionById(sessionId: string): Promise<Session | null>;

  getTherapySessionByUserId(
    userId: string,
    page: number,
    limit: number,
    from: Date | undefined,
    to: Date | undefined,
    status: ProgressStatus | undefined,
  ): Promise<Session[]>;

  countTherapySessionByUserId(
    userId: string,
    from: Date | undefined,
    to: Date | undefined,
    status: ProgressStatus | undefined,
  ): Promise<number>;

  deleteSession(sessionId: string): Promise<Session>;

  deleteSessions(sessionIds: string[]): Promise<void>;
}
