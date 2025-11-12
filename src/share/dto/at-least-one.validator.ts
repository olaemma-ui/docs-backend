import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * ValidatorConstraint: reusable logic
 * Checks if at least one of the specified properties in the object has a non-empty value.
 */
@ValidatorConstraint({ name: 'AtLeastOne', async: false })
export class AtLeastOneConstraint implements ValidatorConstraintInterface {
    validate(_: any, args: ValidationArguments) {
        const [properties] = args.constraints as [string[]];
        const object = args.object as any;

        return properties.some((p) => {
            const val = object[p];
            if (val === undefined || val === null) return false;
            if (Array.isArray(val)) return val.length > 0;
            if (typeof val === 'string') return val.trim().length > 0;
            return true;
        });
    }

    defaultMessage(args: ValidationArguments) {
        const [properties] = args.constraints as [string[]];
        return `At least one of the following properties must be provided: ${properties.join(', ')}`;
    }
}

/**
 * Decorator: @AtLeastOne(['fileId', 'folderId'])
 * Ensures at least one property among the provided keys is defined and non-empty.
 *
 * Usage:
 *  @AtLeastOne(['fileId', 'folderId'], { message: 'Provide either fileId or folderId' })
 *  export class ShareCreateDTO { ... }
 */
export function AtLeastOne(
    properties: string[],
    validationOptions?: ValidationOptions,
) {
    return function (constructor: Function) {
        registerDecorator({
            name: 'AtLeastOne',
            target: constructor,
            propertyName: "", // <-- no property-level binding
            options: validationOptions,
            constraints: [properties],
            validator: AtLeastOneConstraint,
        });
    };
}
