import { ValidationOptions, ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
export declare class AtLeastOneConstraint implements ValidatorConstraintInterface {
    validate(_: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function AtLeastOne(properties: string[], validationOptions?: ValidationOptions): (constructor: Function) => void;
