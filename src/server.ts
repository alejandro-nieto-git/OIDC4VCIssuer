const express = require("express")
const morgan = require("morgan")
import dotenv from 'dotenv';
import { OID4VCIServer } from "@sphereon/oid4vci-issuer-server";
import { CredentialSupportedBuilderV1_11, VcIssuerBuilder } from "@sphereon/oid4vci-issuer";
import {
    OID4VCICredentialFormat,
} from '@sphereon/oid4vci-common'
import { ExpressBuilder } from "@sphereon/ssi-express-support";
import { Jwt, Alg } from "@sphereon/oid4vci-common";
import * as jose from 'jose'
import { createPrivateKey, KeyObject } from 'crypto';
import { importJWK, JWK, KeyLike} from 'jose';
import { ec as EC } from 'elliptic';

dotenv.config();

const signerCallback = async (jwt: Jwt, kid?: string): Promise<string> => {
    const privateKeyBuffer = Buffer.from(process.env.PRIVATE_KEY_ISSUER!.slice(2), 'hex');

    const ec = new EC('secp256k1');
    const key = ec.keyFromPrivate(privateKeyBuffer);

    const pubPoint = key.getPublic();
    const x = pubPoint.getX().toArrayLike(Buffer, 'be', 32);
    const y = pubPoint.getY().toArrayLike(Buffer, 'be', 32);

    const privateKeyJWK: JWK = {
        kty: 'EC',
        crv: 'secp256k1',
        x: Buffer.from(x).toString('base64url'),
        y: Buffer.from(y).toString('base64url'),
        d: privateKeyBuffer.toString('base64url')
    };
    
    var privateKey = await importJWK(privateKeyJWK, 'ES256K') as KeyLike;

    return new jose.SignJWT({ ...jwt.payload }).setProtectedHeader({ ...jwt.header, alg: Alg.ES256K }).setIssuedAt(+new Date()).setExpirationTime('2h').sign(privateKey);
}


let credentialsSupported = new CredentialSupportedBuilderV1_11()
    .withCryptographicSuitesSupported(process.env.cryptographic_suites_supported as string)
    .withCryptographicBindingMethod(process.env.cryptographic_binding_methods_supported as string)
    .withFormat(process.env.credential_supported_format as unknown as OID4VCICredentialFormat)
    .withId(process.env.credential_supported_id as string)
    .withTypes([process.env.credential_supported_types_1 as string, process.env.credential_supported_types_2 as string])
    .withCredentialSupportedDisplay({
        name: process.env.credential_display_name as string,
        locale: process.env.credential_display_locale as string,
        logo: {
            url: process.env.credential_display_logo_url as string,
            alt_text: process.env.credential_display_logo_alt_text as string,
        },
        background_color: process.env.credential_display_background_color as string,
        text_color: process.env.credential_display_text_color as string,
    })
    .build()

let vcIssuer = new VcIssuerBuilder()
    .withUserPinRequired(process.env.user_pin_required as unknown as boolean)
    .withDefaultCredentialOfferBaseUri(process.env.credential_issuer as string)
    .withCredentialEndpoint(process.env.credential_endpoint as string)
    .withCredentialIssuer(process.env.credential_issuer as string)
    .withIssuerDisplay({
        name: process.env.issuer_name as string,
        locale: process.env.issuer_locale as string,
    })
    .withCredentialsSupported(credentialsSupported)
    .withInMemoryCredentialOfferState()
    .withInMemoryCNonceState()
    .build()

let port = 9000;
let expressSupport = ExpressBuilder.fromServerOpts({
    startListening: false,
    port: port,
    hostname: '0.0.0.0',
}).build({ startListening: false })
const vcIssuerServer = new OID4VCIServer(expressSupport, {
    issuer: vcIssuer,
    baseUrl: 'http://localhost:9000',
    endpointOpts: {
        tokenEndpointOpts: {
            accessTokenSignerCallback: signerCallback,
            tokenPath: '/token',
            preAuthorizedCodeExpirationDuration: 200000,
            tokenExpiresIn: 200000,
        },
    },
})

let app = vcIssuerServer.app;

app.post('/credentialOfferTitulacionDigital', async (req: any, res: any) => {
    let createCredentialOfferResult = await vcIssuerServer.issuer.createCredentialOfferURI(
        {
            "grants": {
                "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
                    "pre-authorized_code": req.body.preAuthorizedCode,
                    "user_pin_required": true
                }
            },
            "credentials": [req.body.credentialToIssue]
        }
    );

    let createCredentialOfferResultString =  JSON.parse(JSON.stringify(createCredentialOfferResult));
    let createCredentialOfferReturnResult = { uri: createCredentialOfferResultString.uri, pin: createCredentialOfferResultString.userPin };
    res.json(createCredentialOfferReturnResult);
});


// Logging
app.use(morgan("dev"))

expressSupport.start()
console.log(`Emisor de titulaciones digitales desplegado en: http://localhost:${port}`)

// Convert hex string to Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) throw new Error('Invalid hex string');
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      array[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return array;
  }