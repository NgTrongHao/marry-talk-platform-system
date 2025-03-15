import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    const sessionDate = new Date(value);
    if (isNaN(sessionDate.getTime())) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set to start of day
    return sessionDate >= today;
  }

  defaultMessage() {
    return 'Session date must be today or in the future';
  }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureDateConstraint,
    });
  };
}
