"use strict";

const multiHashing = require("..");

const includeOptional = process.argv.includes("--all");

function measureRate(iterations, fn) {
  const start = process.hrtime.bigint();
  fn();
  const elapsedNs = process.hrtime.bigint() - start;
  const elapsedSeconds = Number(elapsedNs) / 1e9;
  const rate = elapsedSeconds === 0 ? Infinity : iterations / elapsedSeconds;

  return `${rate.toFixed(2)} H/s`;
}

function benchmark(name, iterations, run, warmup) {
  return {
    name,
    iterations,
    run: () => {
      if (typeof warmup === "function") {
        warmup();
      }

      console.log(`${name}: ${measureRate(iterations, run)}`);
    },
  };
}

const zeroSeed = Buffer.from(
  "0000000000000000000000000000000000000000000000000000000000000000",
  "hex"
);

const baseDefaultBenches = [
  benchmark("randomx-flex", 200, () => {
    const input = Buffer.from(
      "000000208c246d0b90c3b389c4086e8b672ee040d64db5b9648527133e217fbfa48da64c0f3c0a0b0e8350800568b40fbb323ac3ccdf2965de51b9aaeb939b4f11ff81c49b74a16156ff251c00000000",
      "hex"
    );

    for (let i = 0; i < 200; i += 1) {
      multiHashing.cryptonight(input, 19);
    }
  }),
  benchmark("randomx-ghostrider", 200, () => {
    const input = Buffer.from(
      "000000208c246d0b90c3b389c4086e8b672ee040d64db5b9648527133e217fbfa48da64c0f3c0a0b0e8350800568b40fbb323ac3ccdf2965de51b9aaeb939b4f11ff81c49b74a16156ff251c00000000",
      "hex"
    );

    for (let i = 0; i < 200; i += 1) {
      multiHashing.cryptonight(input, 18);
    }
  }),
  benchmark("cryptonight-2", 200, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 200; i += 1) {
      multiHashing.cryptonight(input, 8);
    }
  }),
  benchmark("rx/panther", 200, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 200; i += 1) {
      multiHashing.randomx(input, zeroSeed, 3);
    }
  }),
  benchmark("kawpow", 10000000, () => {
    const headerHash = Buffer.from(
      "63543d3913fe56e6720c5e61e8d208d05582875822628f483279a3e8d9c9a8b3",
      "hex"
    );
    const nonce = Buffer.from("9b95eb33003ba288", "hex");
    const mixHash = Buffer.from(
      "89732e5ff8711c32558a308fc4b8ee77416038a70995670e3eb84cbdead2e337",
      "hex"
    );

    for (let i = 0; i < 10000000; i += 1) {
      multiHashing.kawpow(headerHash, nonce, mixHash);
    }
  }),
  benchmark("etchash", 200, () => {
    const headerHash = Buffer.from(
      "053690289a0a9dac132c268d6ffe64ad8e025b74eefa61b51934c57d2a49d9e4",
      "hex"
    );
    const nonce = Buffer.from("fe09000002a784b0", "hex");

    for (let i = 0; i < 200; i += 1) {
      multiHashing.etchash(headerHash, nonce, 15658542 + i);
    }
  }),
  benchmark("ethash", 200, () => {
    const headerHash = Buffer.from(
      "f5afa3074287b2b33e975468ae613e023e478112530bc19d4187693c13943445",
      "hex"
    );
    const nonce = Buffer.from("ff4136b6b6a244ec", "hex");

    for (let i = 0; i < 200; i += 1) {
      multiHashing.ethash(headerHash, nonce, 1257006 + i);
    }
  }),
  benchmark("astrobwt", 200, () => {
    for (let i = 0; i < 200; i += 1) {
      multiHashing.astrobwt(Buffer.from(`test${i}`), 0);
    }
  }),
  benchmark("astrobwt-dero-he", 20000, () => {
    for (let i = 0; i < 20000; i += 1) {
      multiHashing.astrobwt(Buffer.from(`test${i}`), 1);
    }
  }),
  benchmark("k12", 2000000, () => {
    for (let i = 0; i < 2000000; i += 1) {
      multiHashing.k12(Buffer.from(`test${i}`));
    }
  }),
  benchmark("cryptonight-light", 100, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 100; i += 1) {
      multiHashing.cryptonight_light(input);
    }
  }),
  benchmark("cryptonight-heavy", 100, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 100; i += 1) {
      multiHashing.cryptonight_heavy(input);
    }
  }),
  benchmark("cryptonight-gpu", 100, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 100; i += 1) {
      multiHashing.cryptonight(input, 11);
    }
  }),
  benchmark(
    "rx/wow",
    200,
    () => {
      for (let i = 0; i < 200; i += 1) {
        multiHashing.randomx(Buffer.from(`test${i}`), zeroSeed, 17);
      }
    },
    () => {
      multiHashing.randomx(Buffer.from("test"), zeroSeed, 17);
    }
  ),
  benchmark(
    "rx/switch",
    300,
    () => {
      const seed1 = zeroSeed;
      const seed2 = Buffer.from(
        "0000000000000000000000000000000000000000000000000000000000000001",
        "hex"
      );
      const seed3 = Buffer.from(
        "0000000000000000000000000000000000000000000000000000000000000002",
        "hex"
      );

      for (let i = 0; i < 100; i += 1) {
        const input = Buffer.from(`test${i}`);
        multiHashing.randomx(input, seed1, 2);
        multiHashing.randomx(input, seed2, 3);
        multiHashing.randomx(input, seed3, 0);
      }
    },
    () => {
      multiHashing.randomx(Buffer.from("test"), zeroSeed, 2);
      multiHashing.randomx(
        Buffer.from("test"),
        Buffer.from("0000000000000000000000000000000000000000000000000000000000000001", "hex"),
        3
      );
      multiHashing.randomx(
        Buffer.from("test"),
        Buffer.from("0000000000000000000000000000000000000000000000000000000000000002", "hex"),
        0
      );
    }
  ),
  benchmark("cryptonight-pico", 1000, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 1000; i += 1) {
      multiHashing.cryptonight_pico(input);
    }
  }),
  benchmark("cryptonight-double", 100, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 100; i += 1) {
      multiHashing.cryptonight(input, 16);
    }
  }),
  benchmark("argon2-chukwa2", 200, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 200; i += 1) {
      multiHashing.argon2(input, 2);
    }
  }),
  benchmark("argon2-wrkz", 200, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 200; i += 1) {
      multiHashing.argon2(input, 1);
    }
  }),
];

const baseOptionalBenches = [
  benchmark("argon2-chukwa", 200, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 200; i += 1) {
      multiHashing.argon2(input, 0);
    }
  }),
  benchmark("randomx-loki", 200, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 200; i += 1) {
      multiHashing.randomx(input, zeroSeed, 18);
    }
  }),
  benchmark("cryptonight-rwz", 200, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 200; i += 1) {
      multiHashing.cryptonight(input, 14);
    }
  }),
  benchmark("cryptonight-zls", 200, () => {
    const input = Buffer.from("test");

    for (let i = 0; i < 200; i += 1) {
      multiHashing.cryptonight(input, 15);
    }
  }),
  benchmark(
    "rx/defyx",
    200,
    () => {
      const seed = Buffer.from(
        "1000000000000000000000000000000000000000000000000000000000000000",
        "hex"
      );

      for (let i = 0; i < 200; i += 1) {
        multiHashing.randomx(Buffer.from(`test${i}`), seed, 1);
      }
    },
    () => {
      const seed = Buffer.from(
        "1000000000000000000000000000000000000000000000000000000000000000",
        "hex"
      );
      multiHashing.randomx(Buffer.from("test"), seed, 1);
    }
  ),
  benchmark(
    "rx/graft",
    200,
    () => {
      const seed = zeroSeed;

      for (let i = 0; i < 200; i += 1) {
        multiHashing.randomx(Buffer.from(`test${i}`), seed, 20);
      }
    },
    () => {
      multiHashing.randomx(Buffer.from("test"), zeroSeed, 20);
    }
  ),
  benchmark(
    "rx/keva",
    200,
    () => {
      const seed = zeroSeed;

      for (let i = 0; i < 200; i += 1) {
        multiHashing.randomx(Buffer.from(`test${i}`), seed, 19);
      }
    },
    () => {
      multiHashing.randomx(Buffer.from("test"), zeroSeed, 19);
    }
  ),
  benchmark(
    "rx/loki-seeded",
    200,
    () => {
      const seed = zeroSeed;

      for (let i = 0; i < 200; i += 1) {
        multiHashing.randomx(Buffer.from(`test${i}`), seed, 18);
      }
    },
    () => {
      multiHashing.randomx(Buffer.from("test"), zeroSeed, 18);
    }
  ),
];

// MoneroOcean live support checked against https://api.moneroocean.stream/pool/stats
// on 2026-04-07. Unsupported algos stay available behind --all as legacy coverage.
const legacyBenchNames = new Set([
  "cryptonight-2",
  "ethash",
  "astrobwt",
  "astrobwt-dero-he",
  "k12",
  "cryptonight-light",
  "cryptonight-heavy",
  "cryptonight-double",
  "argon2-wrkz",
  "rx/wow",
]);

const defaultBenches = baseDefaultBenches.filter((bench) => !legacyBenchNames.has(bench.name));
const optionalBenches = baseOptionalBenches.concat(
  baseDefaultBenches.filter((bench) => legacyBenchNames.has(bench.name))
);

function main() {
  const benches = includeOptional ? defaultBenches.concat(optionalBenches) : defaultBenches;

  for (const bench of benches) {
    bench.run();
  }

  if (!includeOptional && optionalBenches.length > 0) {
    console.log(
      `Skipped ${optionalBenches.length} legacy-only perf cases. Run 'node tests/perf.js --all' to include them.`
    );
  }
}

main();
