export class TimeHelperUtils {
  static convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  static convertMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  static isTimeOverlapping(
    existingStart: string,
    existingEnd: string,
    newStart: string,
    newEnd: string,
  ): boolean {
    const existingStartMin = this.convertTimeToMinutes(existingStart);
    const existingEndMin = this.convertTimeToMinutes(existingEnd);
    const newStartMin = this.convertTimeToMinutes(newStart);
    const newEndMin = this.convertTimeToMinutes(newEnd);

    return !(newEndMin <= existingStartMin || newStartMin >= existingEndMin);
  }
}
