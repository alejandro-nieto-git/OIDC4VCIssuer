"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorizationRequestV1_0_09 = void 0;
// todo https://sphereon.atlassian.net/browse/VDX-185
function isAuthorizationRequestV1_0_09(request) {
    return request && 'op_state' in request;
}
exports.isAuthorizationRequestV1_0_09 = isAuthorizationRequestV1_0_09;
//# sourceMappingURL=v1_0_09.types.js.map