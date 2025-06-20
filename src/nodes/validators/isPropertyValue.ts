import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPropertyValue(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPropertyValue',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (
            typeof value !== 'object' ||
            value === null ||
            Array.isArray(value)
          ) {
            return false;
          }

          return Object.entries(value).every(
            ([key, val]) =>
              typeof key === 'string' && typeof val === 'number'
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an object where all keys are strings and all values are numbers`;
        },
      },
    });
  };
}
