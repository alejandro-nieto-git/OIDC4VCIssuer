import { AssertedUniformCredentialOffer, CredentialOfferSession } from '@sphereon/oid4vci-common';
export declare class CredentialOfferStateBuilder {
    private readonly credentialOfferState;
    constructor();
    credentialOffer(credentialOffer: AssertedUniformCredentialOffer): CredentialOfferStateBuilder;
    createdAt(timestamp: number): CredentialOfferStateBuilder;
    build(): CredentialOfferSession;
}
//# sourceMappingURL=CredentialOfferStateBuilder.d.ts.map