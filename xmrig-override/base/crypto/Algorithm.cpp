/* XMRig
 * Copyright 2010      Jeff Garzik <jgarzik@pobox.com>
 * Copyright 2012-2014 pooler      <pooler@litecoinpool.org>
 * Copyright 2014      Lucas Jones <https://github.com/lucasjones>
 * Copyright 2014-2016 Wolf9466    <https://github.com/OhGodAPet>
 * Copyright 2016      Jay D Dee   <jayddee246@gmail.com>
 * Copyright 2017-2018 XMR-Stak    <https://github.com/fireice-uk>, <https://github.com/psychocrypt>
 * Copyright 2018      Lee Clagett <https://github.com/vtnerd>
 * Copyright 2018-2019 SChernykh   <https://github.com/SChernykh>
 * Copyright 2016-2019 XMRig       <https://github.com/xmrig>, <support@xmrig.com>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


#include "crypto/common/Algorithm.h"

xmrig::Algorithm::Family xmrig::Algorithm::family(Id id)
{
    switch (id) {
    case CN_0:
    case CN_1:
    case CN_2:
    case CN_R:
    case CN_FAST:
    case CN_HALF:
    case CN_XAO:
    case CN_RTO:
    case CN_RWZ:
    case CN_ZLS:
    case CN_DOUBLE:
    case CN_CCX:
#   ifdef XMRIG_ALGO_CN_GPU
    case CN_GPU:
#   endif
        return CN;

#   ifdef XMRIG_ALGO_CN_LITE
    case CN_LITE_0:
    case CN_LITE_1:
        return CN_LITE;
#   endif

#   ifdef XMRIG_ALGO_CN_HEAVY
    case CN_HEAVY_0:
    case CN_HEAVY_TUBE:
    case CN_HEAVY_XHV:
        return CN_HEAVY;
#   endif

#   ifdef XMRIG_ALGO_CN_PICO
    case CN_PICO_0:
    case CN_PICO_TLO:
        return CN_PICO;
#   endif

#   ifdef XMRIG_ALGO_RANDOMX
    case RX_0:
    case RX_WOW:
    case RX_LOKI:
    case RX_KEVA:
    case DEFYX:
    case RX_ARQ:
    case RX_SFX:
        return RANDOM_X;
#   endif

#   ifdef XMRIG_ALGO_ARGON2
    case AR2_CHUKWA:
    case AR2_WRKZ:
        return ARGON2;
#   endif

#   ifdef XMRIG_ALGO_ASTROBWT
    case ASTROBWT_DERO:
        return ASTROBWT;
#   endif

#   ifdef XMRIG_ALGO_KAWPOW
    case KAWPOW_RVN:
        return KAWPOW;
#   endif

    default:
        break;
    }

    return UNKNOWN;
}

size_t xmrig::Algorithm::l2() const
{
#   ifdef XMRIG_ALGO_RANDOMX
    switch (m_id) {
    case RX_0:
    case RX_LOKI:
    case RX_SFX:
        return 0x40000;

    case RX_WOW:
    case RX_KEVA:
    case RX_DEFYX:
        return 0x20000;

    case RX_ARQ:
        return 0x10000;

    default:
        break;
    }
#   endif

    return 0;
}


size_t xmrig::Algorithm::l3() const
{
    constexpr size_t oneMiB = 0x100000;

    const auto f = family();
    assert(f != UNKNOWN);

    switch (f) {
    case CN:
        return oneMiB * 2;

    case CN_LITE:
        return oneMiB;

    case CN_HEAVY:
        return oneMiB * 4;

    case CN_PICO:
        return oneMiB / 4;

    default:
        break;
    }

#   ifdef XMRIG_ALGO_RANDOMX
    if (f == RANDOM_X) {
        switch (m_id) {
        case RX_0:
        case RX_LOKI:
        case RX_SFX:
            return oneMiB * 2;

        case RX_WOW:
        case RX_KEVA:
            return oneMiB;

        case RX_ARQ:
        case RX_DEFYX:
            return oneMiB / 4;

        default:
            break;
        }
    }
#   endif

#   ifdef XMRIG_ALGO_ARGON2
    if (f == ARGON2) {
        switch (m_id) {
        case AR2_CHUKWA:
            return oneMiB / 2;

        case AR2_WRKZ:
            return oneMiB / 4;

        default:
            break;
        }
    }
#   endif

#   ifdef XMRIG_ALGO_ASTROBWT
    if (f == ASTROBWT) {
        switch (m_id) {
        case ASTROBWT_DERO:
            return oneMiB * 20;

        default:
            break;
        }
    }
#   endif

#   ifdef XMRIG_ALGO_KAWPOW
    if (f == KAWPOW) {
        switch (m_id) {
        case KAWPOW_RVN:
            return 32768;

        default:
            break;
        }
    }
#   endif

    return 0;
}