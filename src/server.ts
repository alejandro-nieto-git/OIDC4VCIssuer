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
import jose from "jose";
import { KeyLike, KeyObject } from 'crypto';

dotenv.config();

const signerCallback = async (jwt: Jwt, kid?: string): Promise<string> => {
    const privateKey = (process.env.PRIVATE_KEY_ISSUER as KeyLike) as KeyObject
    return new jose.SignJWT({ ...jwt.payload }).setProtectedHeader({ ...jwt.header, alg: Alg.ES256 }).sign(privateKey)
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
            tokenPath: '/test/token',
            preAuthorizedCodeExpirationDuration: 2000,
            tokenExpiresIn: 300,
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