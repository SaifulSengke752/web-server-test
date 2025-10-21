const forge = require('node-forge');
const fs = require('fs');

// Buat pasangan kunci RSA 2048 bit
const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(2048);

// Konversi ke format PEM agar mudah disimpan
const publicPem = forge.pki.publicKeyToPem(publicKey);
const privatePem = forge.pki.privateKeyToPem(privateKey);

// Simpan ke file
fs.writeFileSync('public.pem', publicPem);
fs.writeFileSync('private.pem', privatePem);

console.log('Public dan Private key berhasil dibuat!');
