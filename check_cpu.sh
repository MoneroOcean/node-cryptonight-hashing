
set -e
QUERY="$1"
ARCH="$(uname -m)"

is_arm64() {
    [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]
}

check_mac() {
    case "$1" in
      avx) is_arm64 && return 1; sysctl -n machdep.cpu.features 2>/dev/null | grep -i avx >/dev/null;;
      avx2) is_arm64 && return 1; sysctl -n machdep.cpu.features 2>/dev/null | grep -i avx2 >/dev/null;;
      amd) is_arm64 && return 1; sysctl -n machdep.cpu.vendor 2>/dev/null | grep -i amd >/dev/null;;
      amdnew) is_arm64 && return 1; sysctl -n machdep.cpu.vendor 2>/dev/null | grep -i amd >/dev/null && test "$(sysctl -n machdep.cpu.family 2>/dev/null)" -ge 23;;
      intel) is_arm64 && return 1; sysctl -n machdep.cpu.vendor 2>/dev/null | grep -i intel >/dev/null;;
      sse2) is_arm64 && return 1; sysctl -n machdep.cpu.features 2>/dev/null | grep -i sse2 >/dev/null;;
      ssse3) is_arm64 && return 1; sysctl -n machdep.cpu.features 2>/dev/null | grep -i ssse3 >/dev/null;;
      avx512f) is_arm64 && return 1; sysctl -n machdep.cpu.features 2>/dev/null | grep -i avx512f >/dev/null;;
      xop) is_arm64 && return 1; sysctl -n machdep.cpu.features 2>/dev/null | grep -i xop >/dev/null;;
      *) echo "UNRECOGNISED CHECK $QUERY"; exit 1; ;;
    esac
}

check_linux() {
    case "$1" in
      avx) grep avx /proc/cpuinfo >/dev/null;;
      avx2) grep avx2 /proc/cpuinfo >/dev/null;;
      amd) grep -i amd /proc/cpuinfo >/dev/null;;
      amdnew) grep -i amd /proc/cpuinfo >/dev/null && test `awk '/cpu family/ && $NF~/^[0-9]*$/ {print $NF}' /proc/cpuinfo | head -n1` -ge 23 >/dev/null;;
      intel) grep -i intel /proc/cpuinfo >/dev/null;;
      sse2) grep sse2 /proc/cpuinfo >/dev/null;;
      ssse3) grep ssse3 /proc/cpuinfo >/dev/null;;
      avx512f) grep avx512f /proc/cpuinfo >/dev/null;;
      xop) grep xop /proc/cpuinfo >/dev/null;;
      *) echo "UNRECOGNISED CHECK $QUERY"; exit 1; ;;
    esac
}

case "$(uname -s)" in
  Darwin) check_mac "$QUERY" ;;
  *) check_linux "$QUERY" ;;
esac
