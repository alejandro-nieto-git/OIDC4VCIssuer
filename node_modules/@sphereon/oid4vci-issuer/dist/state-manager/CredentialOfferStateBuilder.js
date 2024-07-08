"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialOfferStateBuilder = void 0;
class CredentialOfferStateBuilder {
    constructor() {
        this.credentialOfferState = {};
    }
    credentialOffer(credentialOffer) {
        this.credentialOfferState.credentialOffer = credentialOffer;
        return this;
    }
    createdAt(timestamp) {
        this.credentialOfferState.createdAt = timestamp;
        return this;
    }
    build() {
        if (!this.credentialOfferState.createdAt) {
            this.credentialOfferState.createdAt = +new Date();
        }
        if (!this.credentialOfferState.credentialOffer) {
            throw new Error('Not all properties are present to build an IssuerState object');
        }
        return this.credentialOfferState;
    }
}
exports.CredentialOfferStateBuilder = CredentialOfferStateBuilder;
//# sourceMappingURL=CredentialOfferStateBuilder.js.map