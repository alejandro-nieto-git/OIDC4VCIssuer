import { AuthorizationDetailsJwtVcJson, OID4VCICredentialFormat } from '@sphereon/oid4vci-common';
export declare class AuthorizationDetailsBuilder {
    private readonly authorizationDetails;
    constructor();
    withType(type: string): AuthorizationDetailsBuilder;
    withFormats(format: OID4VCICredentialFormat): AuthorizationDetailsBuilder;
    withLocations(locations: string[]): AuthorizationDetailsBuilder;
    addLocation(location: string): AuthorizationDetailsBuilder;
    buildJwtVcJson(): AuthorizationDetailsJwtVcJson;
}
//# sourceMappingURL=AuthorizationDetailsBuilder.d.ts.map