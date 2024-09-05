# X25519KeyAgreementKey2020 _(@digitalcredentials/x25519-key-agreement-key-2020)_

[![NPM Version](https://img.shields.io/npm/v/@digitalcredentials/x25519-key-agreement-key-2020.svg)](https://npm.im/@digitalcredentials/x25519-key-agreement-key-2020)

> An X25519 (Curve25519) DH (Diffie-Hellman) key implementation to work with the X25519 2020 Crypto suite.

## Table of Contents

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Security

TBD

## Background

(Forked from [`digitalbazaar/x25519-key-agreement-key-2020` v2.0.0](https://github.com/digitalbazaar/x25519-key-agreement-key-2020)
to provide TypeScript compatibility.)

For use with [`crypto-ld`](https://github.com/digitalbazaar/crypto-ld) `>= 5.0`.

To actually perform encryption with those keys, we recommend you use
the [`minimal-cipher`](https://github.com/digitalbazaar/minimal-cipher) library.

This is a low-level level library to generate and serialize X25519 (Curve25519)
key pairs (uses `nacl.box` under the hood).

See also (related specs):

* [Linked Data Proofs](https://w3c-ccg.github.io/ld-proofs/)
* [Linked Data Cryptographic Suite Registry](https://w3c-ccg.github.io/ld-cryptosuite-registry/)

## Install

Requires Node.js 12+

To install locally (for development):

```
git clone https://github.com/digitalcredentials/x25519-key-agreement-key-2020.git
cd x25519-key-agreement-key-2020
npm install
```

## Usage

Importing:

```
const {X25519KeyAgreementKey2020} = require('@digitalcredentials/x25519-key-agreement-key-2020');

// Or, if you're testing code in the interactive Node CLI, right in this repo:
const {X25519KeyAgreementKey2020} = require('./');
```

Generating:

```js
const keyPair = await X25519KeyAgreementKey2020.generate({
  controller: 'did:example:1234'
});
// ->
{
  "id": "did:example:1234#z6LSeRSE5Em5oJpwdk3NBaLVERBS332ULC7EQq5EtMsmXhsM",
  "controller": "did:example:1234",
  "type": "X25519KeyAgreementKey2020",
  "publicKeyMultibase": "z6LSeRSE5Em5oJpwdk3NBaLVERBS332ULC7EQq5EtMsmXhsM",
  "privateKeyMultibase": "z3weeMD56C1T347EmB6kYNS7trpQwjvtQCpCYRpqGz6mcemT"
}

```

Serializing just the public key:

```js
keyPair.export({publicKey: true});
// ->
{
  "id": "did:example:1234#z6LSeRSE5Em5oJpwdk3NBaLVERBS332ULC7EQq5EtMsmXhsM",
  "controller": "did:example:1234",
  "type": "X25519KeyAgreementKey2020",
  "publicKeyMultibase": "z6LSeRSE5Em5oJpwdk3NBaLVERBS332ULC7EQq5EtMsmXhsM"
}
```

Serializing both the private and public key:

```js
// a different key pair than the previous example
await keyPair.export({publicKey: true, privateKey: true})
// ->
{
  "id": "did:example:1234#z6LSeRSE5Em5oJpwdk3NBaLVERBS332ULC7EQq5EtMsmXhsM",
  "controller": "did:example:1234",
  "type": "X25519KeyAgreementKey2020",
  "publicKeyMultibase": "z6LSeRSE5Em5oJpwdk3NBaLVERBS332ULC7EQq5EtMsmXhsM",
  "privateKeyMultibase": "z3weeMD56C1T347EmB6kYNS7trpQwjvtQCpCYRpqGz6mcemT"
}
```

Deserializing:

```js
// Loading public key only
const keyPair = await X25519KeyAgreementKey2020.from({
  "id": "did:example:1234#z6LSeRSE5Em5oJpwdk3NBaLVERBS332ULC7EQq5EtMsmXhsM",
  "controller": "did:example:1234",
  "type": "X25519KeyAgreementKey2020",
  "publicKeyMultibase": "z6LSeRSE5Em5oJpwdk3NBaLVERBS332ULC7EQq5EtMsmXhsM"
});
```

## Contribute

See [the contribute file](https://github.com/digitalbazaar/bedrock/blob/master/CONTRIBUTING.md)!

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

* MIT License - DCC - TypeScript compatibility.
* New BSD License (3-clause) © 2020-2021 Digital Bazaar - Initial implementation.
