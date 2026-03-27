#!/usr/bin/env bash
# scripts/lib.sh — Shared constants for OmniBrain-AI-Proxy-Smart CLI
set -euo pipefail

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ── Project Info ──
PROJECT_NAME="OmniBrain-AI-Proxy-Smart"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_URL="https://github.com/ANONIMO432HZ/OmniBrain-AI-Proxy-Smart"

# ── Helpers ──
is_termux() {
    [ -n "${PREFIX:-}" ]
}

is_bun() {
    command -v bun &>/dev/null
}

get_platform() {
    if is_termux; then
        echo "termux"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}
