import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * Custom validator to validate that a property is an object with:
 * - Keys as strings
 * - Values as numbers
 * @export
 * @param {ValidationOptions} [validationOptions]
 * @return {*}
 */

export function IsPropertyValue(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPropertyValue',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        /**
         * Validates that the value is:
         * - an object (not array or null)
         * - with all keys as strings
         * - with all values as numbers
         */
        validate(value: any, args: ValidationArguments) {
          if (
            typeof value !== 'object' ||
            value === null ||
            Array.isArray(value)
          ) {
            return false;
          }
          // Check each entry to ensure key is string and value is number
          return Object.entries(value).every(
            ([key, val]) => typeof key === 'string' && typeof val === 'number',
          );
        },
        // Default error message if the validation fails
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be an object where all keys are strings and all values are numbers`;
        },
      },
    });
  };
}
