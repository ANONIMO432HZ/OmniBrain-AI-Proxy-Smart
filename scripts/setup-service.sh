#!/usr/bin/env bash
# scripts/setup-service.sh — Configure OmniBrain as a Termux background service
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib.sh"

SERVICE_NAME="omnibrain-proxy"
TERMUX_SV_DIR="$HOME/.termux/services/$SERVICE_NAME"
RUN_SCRIPT="$TERMUX_SV_DIR/run"

echo -e "${PURPLE}${BOLD}OmniBrain-AI-Proxy-Smart — Configure Service${NC}"
echo -e "────────────────────────────────────────"

# 1. Prerequisites (Check for termux-services and node/bun)
if ! is_termux; then
    echo -e "${RED}[FAIL]${NC} This service manager is only for Termux on Android."
    exit 1
fi

if ! command -v sv &>/dev/null; then
    echo -e "  Installing termux-services..."
    pkg install -y termux-services 2>/dev/null || { echo -e "${RED}[FAIL]${NC} Could not install termux-services"; exit 1; }
fi

# 2. Check if service exists
if [ -d "$TERMUX_SV_DIR" ] && [ -f "$RUN_SCRIPT" ]; then
    echo -e "  Service $SERVICE_NAME already exists."
fi

# 3. Create Service structure
echo -e "  Configuring background service for $PROJECT_NAME..."
mkdir -p "$TERMUX_SV_DIR"

cat > "$RUN_SCRIPT" <<EOF
#!/usr/bin/env bash
# Termux service definition for OmniBrain Proxy
set -euo pipefail

# Home environment setup
[ -f "\$HOME/.bashrc" ] && source "\$HOME/.bashrc"

# Path setup
cd "$PROJECT_DIR" || exit 1

# Detection: Bun is better if present, otherwise Node
if command -v bun &>/dev/null; then
    echo "Starting OmniBrain with Bun..."
    # Keep it running
    exec bun start:bun 2>&1
else
    echo "Starting OmniBrain with Node.js..."
    exec npm run start:node 2>&1
fi
EOF

chmod +x "$RUN_SCRIPT"

# 4. Enable Service
echo -e "  Enabling and starting service..."
sv-enable "$SERVICE_NAME"

echo -e "${GREEN}[OK]${NC}   Service configured and activated."
echo -e "       Use 'omni stop' to stop it."
echo -e "       Use 'omni logs' to watch activity."
echo ""
echo -e "Note: The proxy will now start automatically when Termux starts."
