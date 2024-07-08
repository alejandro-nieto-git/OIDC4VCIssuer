import { CredentialOfferRequestWithBaseUrl, OpenId4VCIVersion } from '@sphereon/oid4vci-common';
export declare class CredentialOfferClient {
    static fromURI(uri: string, opts?: {
        resolve?: boolean;
    }): Promise<CredentialOfferRequestWithBaseUrl>;
    static toURI(requestWithBaseUrl: CredentialOfferRequestWithBaseUrl, opts?: {
        version?: OpenId4VCIVersion;
    }): string;
}
//# sourceMappingURL=CredentialOfferClient.d.ts.map