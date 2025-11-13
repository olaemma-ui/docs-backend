"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtLeastOneConstraint = void 0;
exports.AtLeastOne = AtLeastOne;
const class_validator_1 = require("class-validator");
let AtLeastOneConstraint = class AtLeastOneConstraint {
    validate(_, args) {
        const [properties] = args.constraints;
        const object = args.object;
        return properties.some((p) => {
            const val = object[p];
            if (val === undefined || val === null)
                return false;
            if (Array.isArray(val))
                return val.length > 0;
            if (typeof val === 'string')
                return val.trim().length > 0;
            return true;
        });
    }
    defaultMessage(args) {
        const [properties] = args.constraints;
        return `At least one of the following properties must be provided: ${properties.join(', ')}`;
    }
};
exports.AtLeastOneConstraint = AtLeastOneConstraint;
exports.AtLeastOneConstraint = AtLeastOneConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'AtLeastOne', async: false })
], AtLeastOneConstraint);
function AtLeastOne(properties, validationOptions) {
    return function (constructor) {
        (0, class_validator_1.registerDecorator)({
            name: 'AtLeastOne',
            target: constructor,
            propertyName: "",
            options: validationOptions,
            constraints: [properties],
            validator: AtLeastOneConstraint,
        });
    };
}
//# sourceMappingURL=at-least-one.validator.js.map