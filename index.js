const nativeBinding = require("bindings")("cryptonight-hashing.node");
const blake2 = require("blake2");

module.exports = nativeBinding;

function bigIntToBufferBE(value, width) {
  if (typeof value !== "bigint") {
    throw new TypeError("value must be a bigint");
  }

  const buffer = Buffer.alloc(width);
  let remaining = value;

  for (let offset = width - 1; offset >= 0; offset -= 1) {
    buffer[offset] = Number(remaining & 0xffn);
    remaining >>= 8n;
  }

  if (remaining !== 0n) {
    throw new RangeError("value does not fit in the requested width");
  }

  return buffer;
}

function bufferToBigIntBE(buffer) {
  let value = 0n;

  for (const byte of buffer) {
    value = (value << 8n) | BigInt(byte);
  }

  return value;
}

const M = Buffer.alloc(1024 * 8);
for (let i = 0; i < 1024; i += 1) {
  M.writeBigUInt64BE(BigInt(i), i * 8);
}

const NBase                  = BigInt(Math.pow(2, 26));
const IncreaseStart          = 600 * 1024;
const IncreasePeriodForN     = 50 * 1024;
const NIncreasementHeightMax = 9216000;

const N = height => {
  height = Math.min(NIncreasementHeightMax, height);
  if (height < IncreaseStart) {
    return NBase;
  } else if(height >= NIncreasementHeightMax){
    return 2147387550;
  } else {
    let res = NBase;
    let iterationsNumber = Math.floor((height - IncreaseStart) / IncreasePeriodForN) + 1;
    for (let i = 0; i < iterationsNumber; i++) {
      res = res / BigInt(100) * BigInt(105);
    }
    return res;
  }
}

function blake2b(seed) {
  const h = blake2.createHash("blake2b", { digestLength: 32 });
  h.update(seed);
  return h.digest();
}

function genIndexes(seed, height) {
  const hash = blake2b(seed);
  const extendedHash = new Uint8Array(hash.length * 2);
  extendedHash.__proto__ = hash.__proto__;
  extendedHash.set(hash);
  extendedHash.set(hash, hash.length);
  return Array.from({length: 32}).map((_, index) => extendedHash.readUIntBE(index, 4) % parseInt(N(height)))
}

// function serializeCoinbase(extraNonce1, extraNonce2){
//   return Buffer.concat([
//     msg,
//     extraNonce1,
//     extraNonce2
//   ]);
// };
// const extraNonce1Buffer = Buffer.from(extraNonce1, 'hex');
// const extraNonce2Buffer = Buffer.from(extraNonce2, 'hex');
// const coinbaseBuffer = serializeCoinbase(extraNonce1Buffer, extraNonce2Buffer);

module.exports.autolykos2_hashes = function(coinbaseBuffer, height) {
  const h = bigIntToBufferBE(BigInt(height), 4);
  const i = bigIntToBufferBE(bufferToBigIntBE(blake2b(coinbaseBuffer).slice(24, 32)) % N(height), 4);
  const e = blake2b(Buffer.concat([i, h, M])).slice(1, 32);
  const J = genIndexes(Buffer.concat([e, coinbaseBuffer]), height).map(item => bigIntToBufferBE(BigInt(item), 4));
  const f = J.map(item => bufferToBigIntBE(blake2b(Buffer.concat([item, h, M])).slice(1, 32))).reduce((a, b) => a + b);
  const hash = bigIntToBufferBE(f, 32);

  return [ hash, blake2b(hash) ];
};
