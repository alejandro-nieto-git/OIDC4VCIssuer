import { CredentialFormat } from '@sphereon/ssi-types';
import { OID4VCICredentialFormat, OpenId4VCIVersion } from '../types';
export declare function isFormat<T extends {
    format?: OID4VCICredentialFormat;
}, Format extends OID4VCICredentialFormat>(formatObject: T, format: Format): formatObject is T & {
    format: Format;
};
export declare function isNotFormat<T extends {
    format?: OID4VCICredentialFormat;
}, Format extends OID4VCICredentialFormat>(formatObject: T, format: Format): formatObject is T & {
    format: Exclude<OID4VCICredentialFormat, Format>;
};
export declare function getUniformFormat(format: string | OID4VCICredentialFormat | CredentialFormat): OID4VCICredentialFormat;
export declare function getFormatForVersion(format: string, version: OpenId4VCIVersion): OID4VCICredentialFormat;
//# sourceMappingURL=FormatUtils.d.ts.map