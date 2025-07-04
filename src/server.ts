import dotenv from 'dotenv';
dotenv.config();
const express = require("express");
const morgan = require("morgan");
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
import { EthrDID } from 'ethr-did'
import { Issuer, createVerifiableCredentialJwt } from 'did-jwt-vc'
import { TitulacionDAO } from './titulacion-digital-model/src/persistence/titulacionDAO';
import { ObjectId } from 'mongodb';
import { TitulacionCredential } from './titulacion-digital-model/src/model/titulacion';
import { fetchTitulacionesFromUVa, hashWithPredefinedSalt } from './utils/func';
import { ethers } from "ethers";
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';





dotenv.config();

const issuer = new EthrDID({
  identifier: process.env.UVA_ETH_ACCOUNT!,
  privateKey: process.env.PRIVATE_KEY_ISSUER, 
}) as Issuer

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
  .withId("did:ethr:" + process.env.UVA_ETH_ACCOUNT?.split("0x") as string)
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
let credential = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  type: [process.env.credential_supported_types_1 as string, process.env.credential_supported_types_2 as string],
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
  .withCredentialSignerCallback(async () =>
    Promise.resolve({
      ...credential,
      proof: {
        type: IProofType.JwtProof2020,
        jwt: await createVerifiableCredentialJwt(credential, issuer),
        created: new Date().toISOString(),
        proofPurpose: IProofPurpose.assertionMethod,
        verificationMethod: process.env.credential_supported_id + "#key-1",
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
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

app.post("/credentialOfferTitulacionDigital", async (req: any, res: any) => {
  credential.issuanceDate = new Date().toISOString();
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


app.get("/titulaciones", async (req: any, res: any) => {
    const { id } = req.query;

    const filter: any = {};
    if (id) {
      filter._id = new ObjectId(id);
    }

    const titulaciones = await TitulacionDAO.findTitulaciones(filter);

    res.json(titulaciones);
});


app.get("/titulacionesFisicasUVa", async (req: any, res: any) => {
  res.json(fetchTitulacionesFromUVa());
});


app.get("/titulaciones/:id", async (req: any, res: any) => {
  const { id } = req.params; 
  const objectId = new ObjectId(id); 

  const titulacion = await TitulacionDAO.findTitulaciones({ _id: objectId });

  if (titulacion.length === 0) {
    return res.status(404).json({ message: 'Titulacion not found' });
  }

  res.json(titulacion[0]);
});


app.put("/titulaciones/:id", async (req: any, res: any) => {
    const { id } = req.params;
    const update: Partial<TitulacionCredential> = req.body;
    const result = await TitulacionDAO.updateTitulacion(id, update);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Credential not found or no changes made." });
    }

    res.json({ message: "Credential updated successfully" });
});



app.delete("/titulaciones/:id", async (req: any, res: any) => {
    const { id } = req.params; 
    const objectId = new ObjectId(id); 
    const titulacion = await TitulacionDAO.findTitulaciones({ _id: objectId });

    let noTypeTitulacion = titulacion[0] as any;
    delete noTypeTitulacion._id;
    delete noTypeTitulacion.issuer;
    delete noTypeTitulacion.proof;
   try {
     let hashedObject = hashWithPredefinedSalt(JSON.stringify(noTypeTitulacion));
     const provider = new ethers.JsonRpcProvider(process.env.NODE_RPC_ADDRESS); // Change URL if using another network
     const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_ISSUER!, provider);
     const revokationRegistryContract = new ethers.Contract(process.env.TITULACION_DIGITAL_REVOCATION_REGISTRY_ADDRESS!, process.env.TITULACION_DIGITAL_REVOCATION_REGISTRY_ABI!, wallet);
     let tx;
     if (!(await revokationRegistryContract.isRevoked(hashedObject))){
      tx = await revokationRegistryContract.revokeTitulacion(hashedObject);
      await tx.wait();
     }
     console.log('Type of formattedValue:', typeof hashedObject);
     console.log('Value of formattedValue:', hashedObject);
     console.log('Titulación is now on revokation status:', await revokationRegistryContract.isRevoked(hashedObject));

     res.json({ message: "Credential revoked successfully: " + await revokationRegistryContract.isRevoked(hashedObject) });
   } catch (error) {
      console.log(error);
      res.status(500).send("Blockchain connection error. Please retry.");
   }
});

app.post("/generate-pkpass", async (req: any, res: any) => {
    const titulacionVc = req.body;
    const outputPath = path.join(__dirname, 'titulacion.pkpass');

    try{
      await generatePKPASS(titulacionVc, outputPath);
      res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
      res.setHeader('Content-Disposition', 'attachment; filename="titulacion.pkpass"');
      res.sendFile(outputPath, (err: any) => {
        if (err) {
          console.error('Failed to send file:', err);
          res.status(500).send('Could not send file');
        } else {
          fs.unlinkSync(outputPath);
        }
      });
      

    } catch (err) {
      console.error('Error generating pkpass:', err);
      res.status(500).send('Failed to generate .pkpass file');
    }
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
  let titulaciones = fetchTitulacionesFromUVa();
  let titulacionesFiltradas = titulaciones.filter(titulacion => titulacion.codigoTitulacion === idTitulacionAEmitir);
  let titulacion = titulacionesFiltradas[0];

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
            revocada: false,
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

/**
 * Generates a PKPASS file at the root folder from the titulacion credential inputted. 
 * 
 * @param titulacionVc The titulacion credential to be put as a PKPASS.
 * @param outputPath The path for generating the PKPASS.
 * @returns A promise that resolves when the PKPASS is generated at the root folder.
 */
async function generatePKPASS(titulacionVc: any, outputPath: string) {
  
  const subject = titulacionVc.credentialSubject;
  const tit = subject.hasTitulacion.display[0];

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: "pass.com.example.titulacion",
    serialNumber: "12345678A",
    teamIdentifier: "ABCD1234XY",
    organizationName: "Universidad Digital",
    description: "Titulación Digital - " + tit.nombreTitulacion,
    logoText: "Titulación Digital",
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(0, 122, 255)",
    generic: {
      primaryFields: [
        {
          key: "name",
          label: "Nombre",
          value: `${subject.nombre.display[0].nombre} ${subject.apellido1.display[0].apellido1} ${subject.apellido2.display[0].apellido2}`
        }
      ],
      secondaryFields: [
        {
          key: "degree",
          label: "Titulación",
          value: tit.nombreTitulacion
        },
        {
          key: "codigo",
          label: "Código",
          value: tit.codigoTitulacion
        }
      ],
      auxiliaryFields: [
        {
          key: "tipoTitulacion",
          label: "Tipo",
          value: tit.tipo
        },
        {
          key: "promocion",
          label: "Promoción",
          value: tit.promocion
        },
        {
          key: "nota",
          label: "Nota Media",
          value: tit.notaMedia
        }
      ],
      backFields: [
        {
          key: "decreto",
          label: "Decreto Ley",
          value: tit.decretoLey
        }
      ]
    },
    barcode: {
      format: "PKBarcodeFormatQR",
      message: "https://example.org/verify",
      messageEncoding: "iso-8859-1"
    }
  };

  const tempDir = path.join(__dirname, 'pkpass-temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  fs.writeFileSync(path.join(tempDir, 'pass.json'), JSON.stringify(passJson, null, 2));
  fs.writeFileSync(path.join(tempDir, 'icon.png'), Buffer.from([0x89, 0x50, 0x4E, 0x47]));
  fs.writeFileSync(path.join(tempDir, 'logo.png'), Buffer.from([0x89, 0x50, 0x4E, 0x47]));

  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise<void>((resolve, reject) => {
    archive.pipe(output);
    archive.directory(tempDir + '/', false);
    archive.finalize();

    output.on('close', () => {
      fs.rmSync(tempDir, { recursive: true, force: true });
      resolve();
    });

    archive.on('error', err => reject(err));
  });
}