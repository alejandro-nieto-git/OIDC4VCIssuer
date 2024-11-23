import { CredentialFormat } from '@sphereon/ssi-types';
import { ProofOfPossession } from './CredentialIssuance.types';
import { CredentialsSupportedDisplay, CredentialSupportedBrief, IssuerCredentialSubject, MetadataDisplay, NameAndLocale } from './Generic.types';
export interface CredentialRequestV1_0_08 {
    type: string;
    format: CredentialFormat;
    proof?: ProofOfPossession;
}
export interface IssuerMetadataV1_0_08 {
    issuer?: string;
    credential_endpoint: string;
    credentials_supported: CredentialSupportedTypeV1_0_08;
    credential_issuer?: {
        display: NameAndLocale | NameAndLocale[];
    };
    authorization_server?: string;
    token_endpoint?: string;
    display?: MetadataDisplay[];
    [x: string]: unknown;
}
export interface CredentialOfferPayloadV1_0_08 {
    issuer: string;
    credential_type: string[] | string;
    'pre-authorized_code'?: string;
    user_pin_required?: boolean | string;
    op_state?: string;
}
export interface CredentialSupportedTypeV1_0_08 {
    [credentialType: string]: CredentialSupportedV1_0_08;
}
export interface CredentialSupportedFormatV1_0_08 extends CredentialSupportedBrief {
    name?: string;
    types: string[];
}
export interface CredentialSupportedV1_0_08 {
    display?: CredentialsSupportedDisplay[];
    formats: {
        [credentialFormat: string]: CredentialSupportedFormatV1_0_08;
    };
    claims?: IssuerCredentialSubject;
}
//# sourceMappingURL=v1_0_08.types.d.ts.map