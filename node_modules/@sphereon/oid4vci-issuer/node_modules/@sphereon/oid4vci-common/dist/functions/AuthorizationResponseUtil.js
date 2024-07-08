"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAuthorizationResponsePayload = void 0;
const Encoding_1 = require("./Encoding");
const toAuthorizationResponsePayload = (input) => {
    let response = input;
    if (typeof input === 'string') {
        if (input.trim().startsWith('{') && input.trim().endsWith('}')) {
            response = JSON.parse(input);
        }
        else if (input.includes('?') && input.includes('code')) {
            response = (0, Encoding_1.convertURIToJsonObject)(input);
        }
    }
    if (response && typeof response !== 'string') {
        return response;
    }
    throw Error(`Could not create authorization response from the input ${input}`);
};
exports.toAuthorizationResponsePayload = toAuthorizationResponsePayload;
//# sourceMappingURL=AuthorizationResponseUtil.js.map