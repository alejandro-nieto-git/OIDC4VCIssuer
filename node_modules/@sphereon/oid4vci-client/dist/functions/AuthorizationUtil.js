"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMissingPKCEOpts = void 0;
const oid4vci_common_1 = require("@sphereon/oid4vci-common");
const generateMissingPKCEOpts = (pkce) => {
    if (pkce.disabled) {
        return pkce;
    }
    if (!pkce.codeChallengeMethod) {
        pkce.codeChallengeMethod = oid4vci_common_1.CodeChallengeMethod.S256;
    }
    if (!pkce.codeVerifier) {
        pkce.codeVerifier = (0, oid4vci_common_1.generateCodeVerifier)();
    }
    (0, oid4vci_common_1.assertValidCodeVerifier)(pkce.codeVerifier);
    if (!pkce.codeChallenge) {
        pkce.codeChallenge = (0, oid4vci_common_1.createCodeChallenge)(pkce.codeVerifier, pkce.codeChallengeMethod);
    }
    return pkce;
};
exports.generateMissingPKCEOpts = generateMissingPKCEOpts;
//# sourceMappingURL=AuthorizationUtil.js.map