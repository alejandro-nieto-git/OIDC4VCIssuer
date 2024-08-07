const express = require("express");
const morgan = require("morgan");
import dotenv from "dotenv";
import { OID4VCIServer } from "@sphereon/oid4vci-issuer-server";
import {
  CredentialSupportedBuilderV1_11,
  VcIssuerBuilder,
} from "@sphereon/oid4vci-issuer";
import { OID4VCICredentialFormat } from "@sphereon/oid4vci-common";
import { ExpressBuilder } from "@sphereon/ssi-express-support";
import {
  AccessTokenResponse,
  Alg,
  CredentialOfferSession,
  CredentialSupported,
  IssuerCredentialSubjectDisplay,
  Jwt,
  JWTHeader,
  JWTPayload,
  OpenId4VCIVersion,
} from "@sphereon/oid4vci-common";
import * as jose from "jose";
import { createPrivateKey, KeyObject } from "crypto";
import { importJWK, JWK, KeyLike } from "jose";
import { ec as EC } from "elliptic";
import { DIDDocument } from "did-resolver";
import { MemoryStates } from "@sphereon/oid4vci-issuer/dist/state-manager";
import { IProofPurpose, IProofType } from "@sphereon/ssi-types";
import { NameAndLocale } from "@sphereon/oid4vci-common/lib/types/Generic.types";
import { JsonLdIssuerCredentialDefinition } from "@sphereon/oid4vci-common/lib/types/Generic.types";
import { TOKEN_PATH } from "./utils/const";
import cors from 'cors';

dotenv.config();

const signerCallback = async (jwt: Jwt, kid?: string): Promise<string> => {
  const privateKeyBuffer = Buffer.from(
    process.env.PRIVATE_KEY_ISSUER!.slice(2),
    "hex"
  );

  const ec = new EC("secp256k1");
  const key = ec.keyFromPrivate(privateKeyBuffer);

  const pubPoint = key.getPublic();
  const x = pubPoint.getX().toArrayLike(Buffer, "be", 32);
  const y = pubPoint.getY().toArrayLike(Buffer, "be", 32);

  const privateKeyJWK: JWK = {
    kty: "EC",
    crv: "secp256k1",
    x: Buffer.from(x).toString("base64url"),
    y: Buffer.from(y).toString("base64url"),
    d: privateKeyBuffer.toString("base64url"),
  };

  var privateKey = (await importJWK(privateKeyJWK, "ES256K")) as KeyLike;

  return new jose.SignJWT({ ...jwt.payload })
    .setProtectedHeader({ ...jwt.header, alg: Alg.ES256K })
    .setIssuedAt(+new Date())
    .setExpirationTime("2h")
    .sign(privateKey);
};

let credentialsSupported = new CredentialSupportedBuilderV1_11()
  .withCryptographicSuitesSupported(
    process.env.cryptographic_suites_supported as string
  )
  .withCryptographicBindingMethod(
    process.env.cryptographic_binding_methods_supported as string
  )
  .withFormat(
    process.env
      .credential_supported_format as unknown as OID4VCICredentialFormat
  )
  .withId(process.env.credential_supported_id as string)
  .withTypes([
    process.env.credential_supported_types_1 as string,
    process.env.credential_supported_types_2 as string,
  ])
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
  .build();

const stateManager = new MemoryStates<CredentialOfferSession>();
const credential = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  type: [process.env.credential_supported_types_2 as string],
  issuer: process.env.credential_supported_id as string,
  issuanceDate: new Date().toISOString(),
  credentialSubject: {},
};

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
  .withCredentialOfferStateManager(stateManager)
  .withCredentialDataSupplier(() =>
    Promise.resolve({
      format: "jwt_vc_json",
      credential,
    })
  )
  .withInMemoryCredentialOfferURIState()
  .withInMemoryCNonceState()
  .withCredentialSignerCallback(() =>
    Promise.resolve({
      ...credential,
      proof: {
        type: IProofType.JwtProof2020,
        jwt: "ye.ye.ye",
        created: new Date().toISOString(),
        proofPurpose: IProofPurpose.assertionMethod,
        verificationMethod: "sdfsdfasdfasdfasdfasdfassdfasdf",
      },
    })
  )
  .withJWTVerifyCallback((args: { jwt: string; kid?: string }) => {
    const header = jose.decodeProtectedHeader(args.jwt);
    const payload = jose.decodeJwt(args.jwt);

    const kid = header.kid ?? (payload.kid as string).toString();
    const did = kid!.split("#")[0];
    const didDocument: DIDDocument = {
      "@context": "https://www.w3.org/ns/did/v1",
      id: did,
    };
    const alg = header.alg ?? "ES256k";
    return Promise.resolve({
      alg,
      kid,
      did,
      didDocument,
      jwt: {
        header: header as JWTHeader,
        payload: payload as JWTPayload,
      },
    });
  })
  .build();

let port = 9000;
let expressSupport = ExpressBuilder.fromServerOpts({
  startListening: false,
  port: port,
  hostname: "0.0.0.0",
}).build({ startListening: false });
const vcIssuerServer = new OID4VCIServer(expressSupport, {
  issuer: vcIssuer,
  baseUrl: process.env.baseUrl as string,
  endpointOpts: {
    tokenEndpointOpts: {
      accessTokenSignerCallback: signerCallback,
      tokenPath: TOKEN_PATH, 
      preAuthorizedCodeExpirationDuration: 200000,
      tokenExpiresIn: 200000,
    },
  },
});

let app = vcIssuerServer.app;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

app.post("/credentialOfferTitulacionDigital", async (req: any, res: any) => {
  let createCredentialOfferResult = await requestCredentialIssuance(req.body.idTitulacionAEmitir, req.body.preAuthorizedCode);

  let createCredentialOfferResultString = JSON.parse(
    JSON.stringify(createCredentialOfferResult)
  );
  let createCredentialOfferReturnResult = {
    uri: createCredentialOfferResultString.uri,
    pin: createCredentialOfferResultString.userPin,
  };
  res.json(createCredentialOfferReturnResult);
});

// Logging
app.use(morgan("dev"));



expressSupport.start();
console.log(
  `Emisor de titulaciones digitales desplegado en: ${process.env.ISSUER_URL}`
);

/**
 * Converts a hexadecimal string to a Uint8Array.
 * 
 * @param hex The hexadecimal string to convert.
 * @returns The Uint8Array representation of the hexadecimal string.
 * @throws Error if the input hex string is invalid.
 */
function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string");
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    array[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return array;
}

/**
 * Requests the issuance of a titulacion digital credential type.
 * 
 * @param idTitulacionAEmitir - The ID of the credential to be issued.
 * @param preAuthorizedCode - The pre-authorized code for authentication.
 * @returns A promise that resolves to the result of creating the credential offer.
 */
async function requestCredentialIssuance(idTitulacionAEmitir: string, preAuthorizedCode: string) {
  //TODO: use idTitulacionAEmitir at the body to filter the user's titulaciones from the UVA backend
  //This is better than simply letting the client select the info to be issued in the credential since we can't trust the client
  let titulacion = {
    codigoTitulacion: "83639", 
    nombreTitulacion: "Ingeniería Informática",
    tipo: "Grado",
    promocion: "2017",
    notaMedia: "8.6",
    fechaHoraEmision: "2021-07-12T12:00:00Z",
    revocada: false,
    decretoLey: "Real Decreto 123/2017",
    descripcionRegistroFisico: "Registro Físico",
  };

  //TODO: extract info from titulacion and user whenever authentication is implemented
  const credentialDefinition: JsonLdIssuerCredentialDefinition = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    types: ["VerifiableCredential", "TitulacionDigital"],
    credentialSubject: {
      nif: {
        display: [{ nif: "12345678A" }],
      } as IssuerCredentialSubjectDisplay,
      nombre: {
        display: [{ nombre: "Juan" }],
      } as IssuerCredentialSubjectDisplay,
      apellido1: {
        display: [
          {
            apellido1: "Perez",
          },
        ],
      } as IssuerCredentialSubjectDisplay,
      apellido2: {
        display: [
          {
            apellido2: "Gomez",
          },
        ],
      } as IssuerCredentialSubjectDisplay,
      fechaNacimiento: {
        display: [
          {
            fechaNacimiento: "1990-01-01",
          },
        ],
      } as IssuerCredentialSubjectDisplay,
      hasTitulacion: {
        display: [
          {
            codigoTitulacion: titulacion.codigoTitulacion, 
            nombreTitulacion: titulacion.nombreTitulacion,
            tipo: titulacion.tipo,
            promocion: titulacion.promocion,
            notaMedia: titulacion.notaMedia,
            fechaHoraEmision: titulacion.fechaHoraEmision,
            revocada: titulacion.revocada,
            decretoLey: titulacion.decretoLey,
            descripcionRegistroFisico: titulacion.descripcionRegistroFisico,
          },
        ],
      } as IssuerCredentialSubjectDisplay,
    },
  };

  let createCredentialOfferResult =
    await vcIssuerServer.issuer.createCredentialOfferURI({
      grants: {
        "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
          "pre-authorized_code": preAuthorizedCode,
          user_pin_required: true,
        },
      },
      credentials: ["TitulacionDigital"],
      credentialDefinition: credentialDefinition,
    });

    return createCredentialOfferResult;
}

