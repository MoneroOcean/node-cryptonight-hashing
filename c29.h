#pragma once

#include <stdint.h>

#define PROOFSIZE  42
#define PROOFSIZEs 32
#define PROOFSIZEv 32
#define PROOFSIZEb 40
#define PROOFSIZEi 48
#define EDGEBITS 29

typedef struct siphash_keys__
{
	uint64_t k0;
	uint64_t k1;
	uint64_t k2;
	uint64_t k3;
} siphash_keys;

enum verify_code { POW_OK, POW_HEADER_LENGTH, POW_TOO_BIG, POW_TOO_SMALL, POW_NON_MATCHING, POW_BRANCH, POW_DEAD_END, POW_SHORT_CYCLE, POW_UNBALANCED};

extern int c29s_verify(uint32_t edges[PROOFSIZEs], siphash_keys *keys);
extern int c29b_verify(uint32_t edges[PROOFSIZEb], siphash_keys *keys);
extern int c29i_verify(uint32_t edges[PROOFSIZEi], siphash_keys *keys);
extern int c29v_verify(uint32_t edges[PROOFSIZEv], siphash_keys *keys);
extern int c29_verify(uint32_t edges[PROOFSIZE], siphash_keys *keys);
