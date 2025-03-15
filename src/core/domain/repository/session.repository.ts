import { Session } from '../entity/session.entity';

export interface SessionRepository {
  save(session: Session): Promise<Session>;

  getSessionsByBookingId(bookingId: string): Promise<Session[]>;

  findByTherapistAndDate(
    therapistId: string,
    sessionDate: Date,
  ): Promise<Session[]>;

  findSessionById(sessionId: string): Promise<Session | null>;
}
