import { SupportedEncodings } from 'uint8arrays/to-string';
import { CodeChallengeMethod } from '../types';
export declare const CODE_VERIFIER_DEFAULT_LENGTH = 128;
export declare const NONCE_LENGTH = 32;
export declare const generateRandomString: (length: number, encoding?: SupportedEncodings) => string;
export declare const generateNonce: (length?: number) => string;
export declare const generateCodeVerifier: (length?: number) => string;
export declare const createCodeChallenge: (codeVerifier: string, codeChallengeMethod?: CodeChallengeMethod) => string;
export declare const assertValidCodeVerifier: (codeVerifier: string) => void;
//# sourceMappingURL=RandomUtils.d.ts.map