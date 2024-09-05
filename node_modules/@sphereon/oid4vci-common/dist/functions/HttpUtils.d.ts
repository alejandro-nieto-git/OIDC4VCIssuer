import { OpenIDResponse } from '../types';
export declare const getJson: <T>(URL: string, opts?: {
    bearerToken?: (() => Promise<string>) | string;
    contentType?: string;
    accept?: string;
    customHeaders?: Record<string, string>;
    exceptionOnHttpErrorStatus?: boolean;
}) => Promise<OpenIDResponse<T>>;
export declare const formPost: <T>(url: string, body: BodyInit, opts?: {
    bearerToken?: (() => Promise<string>) | string;
    contentType?: string;
    accept?: string;
    customHeaders?: Record<string, string>;
    exceptionOnHttpErrorStatus?: boolean;
}) => Promise<OpenIDResponse<T>>;
export declare const post: <T>(url: string, body?: BodyInit, opts?: {
    bearerToken?: (() => Promise<string>) | string;
    contentType?: string;
    accept?: string;
    customHeaders?: Record<string, string>;
    exceptionOnHttpErrorStatus?: boolean;
}) => Promise<OpenIDResponse<T>>;
export declare const isValidURL: (url: string) => boolean;
export declare const trimBoth: (value: string, trim: string) => string;
export declare const trimEnd: (value: string, trim: string) => string;
export declare const trimStart: (value: string, trim: string) => string;
export declare const adjustUrl: <T extends string | URL>(urlOrPath: T, opts?: {
    stripSlashEnd?: boolean;
    stripSlashStart?: boolean;
    prepend?: string;
    append?: string;
}) => T;
//# sourceMappingURL=HttpUtils.d.ts.map