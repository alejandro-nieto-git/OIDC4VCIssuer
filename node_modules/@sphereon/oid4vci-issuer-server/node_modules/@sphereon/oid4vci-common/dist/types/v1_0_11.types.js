"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorizationRequestV1_0_11 = void 0;
// todo https://sphereon.atlassian.net/browse/VDX-185
function isAuthorizationRequestV1_0_11(request) {
    return request && 'issuer_state' in request;
}
exports.isAuthorizationRequestV1_0_11 = isAuthorizationRequestV1_0_11;
//# sourceMappingURL=v1_0_11.types.js.map