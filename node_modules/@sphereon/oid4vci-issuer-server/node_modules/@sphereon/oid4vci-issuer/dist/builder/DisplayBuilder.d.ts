import { ImageInfo, MetadataDisplay } from '@sphereon/oid4vci-common';
export declare class DisplayBuilder {
    name?: string;
    locale?: string;
    additionalProperties: Record<string, unknown>;
    logo?: ImageInfo;
    backgroundColor?: string;
    textColor?: string;
    withName(name: string): this;
    withLocale(locale: string): this;
    withLogo(logo: ImageInfo): this;
    withBackgroundColor(backgroundColor: string): this;
    withTextColor(textColor: string): this;
    withAdditionalProperties(properties: Record<string, unknown>): this;
    addAdditionalProperty(key: string, value: unknown): this;
    build(): MetadataDisplay;
}
//# sourceMappingURL=DisplayBuilder.d.ts.map