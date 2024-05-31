node-cryptonight-hashing
===============

Cryptonight hashing functions for node.js.


Algorithms
----------
* cryptonight (v0, v1, v2, r, half, xtl, msr, rto, xao, gpu, wow, rwz, zls, double, ccx)
* cryptonight-light (v0, v1)
* cryptonight-heavy (v0, xhv, tube)
* cryptonight-pico (IRD)
* argon2 (chukwa, chukwa2, wrkz)
* astrobwt (DERO, DERO-HE)
* RandomX (Wownero, Arqma, Equilibria, Keva, Graft, Tuske)
* Panther (Scala)
* KangarooTwelve (AEON)
* cuckaroo29s, cuckaroo29v, cuckaroo29b, cuckaroo29i
* KawPow (RVN)
* Ethash (ETH)
* Autolykos2 (ERG)
* Ghostrider (TRM)

Installing locally and testing
-----
```
JOBS=$(nproc) npm install https://github.com/MoneroOcean/node-cryptonight-hashing
node_modules/cryptonight-hashing/tests/run.sh
```

Credits
-------
* [XMrig](https://github.com/xmrig) - For advanced cryptonight implementations from [XMrig](https://github.com/xmrig/xmrig)
* [SChernykh](https://github.com/SChernykh) - For PoW development and its integration help
