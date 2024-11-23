"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alg = exports.JsonURIMode = void 0;
var JsonURIMode;
(function (JsonURIMode) {
    JsonURIMode[JsonURIMode["JSON_STRINGIFY"] = 0] = "JSON_STRINGIFY";
    JsonURIMode[JsonURIMode["X_FORM_WWW_URLENCODED"] = 1] = "X_FORM_WWW_URLENCODED";
})(JsonURIMode || (exports.JsonURIMode = JsonURIMode = {}));
/**
 * Signature algorithms.
 *
 * TODO: Move towards string literal unions and string type, given we do not provide signature/key implementations in this library to begin with
 * @See: https://github.com/Sphereon-Opensource/OID4VCI/issues/88
 */
var Alg;
(function (Alg) {
    Alg["EdDSA"] = "EdDSA";
    Alg["ES256"] = "ES256";
    Alg["ES256K"] = "ES256K";
    Alg["PS256"] = "PS256";
    Alg["PS384"] = "PS384";
    Alg["PS512"] = "PS512";
    Alg["RS256"] = "RS256";
    Alg["RS384"] = "RS384";
    Alg["RS512"] = "RS512";
})(Alg || (exports.Alg = Alg = {}));
//# sourceMappingURL=CredentialIssuance.types.js.map