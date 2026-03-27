#!/usr/bin/env bash
# omni.sh — OmniBrain-AI-Proxy-Smart Management CLI
set -euo pipefail

OMNI_VERSION="1.0.0"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$PROJECT_DIR/scripts/lib.sh" ]; then
    source "$PROJECT_DIR/scripts/lib.sh"
else
    # Fallback minimal logic
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BOLD='\033[1m'
    NC='\033[0m'
fi

show_help() {
    echo ""
    echo -e "${PURPLE}${BOLD}omni${NC} — OmniBrain-AI-Proxy-Smart CLI v$OMNI_VERSION"
    echo ""
    echo "Usage: ./omni.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start          Start proxy in background (Termux service)"
    echo "  stop           Stop the background proxy"
    echo "  restart        Restart the proxy"
    echo "  status         Check if the proxy is running"
    echo "  logs           View live server logs"
    echo "  update         Update from GitHub (git pull & install)"
    echo "  setup-service  Configure it as a Termux background service"
    echo "  env            Open .env file to edit keys"
    echo "  version, -v    Show version"
    echo "  help, -h       Show this help message"
    echo ""
}

case "${1:-}" in
    start)
        if command -v sv &>/dev/null; then
            echo -e "${CYAN}Starting OmniBrain-AI-Proxy-Smart...${NC}"
            sv start omnibrain-proxy || { echo -e "${RED}[FAIL]${NC} Service not found. Run: ./omni.sh setup-service"; exit 1; }
        else
            echo -e "${YELLOW}Starting in foreground (Termux services not detected)...${NC}"
            if command -v bun &>/dev/null; then
                bun start:bun
            else
                npm run start:node
            fi
        fi
        ;;
    stop)
        if command -v sv &>/dev/null; then
            echo -e "${YELLOW}Stopping OmniBrain-AI-Proxy-Smart...${NC}"
            sv stop omnibrain-proxy || true
        else
            echo -e "${RED}[FAIL]${NC} termux-services not installed."
            exit 1
        fi
        ;;
    restart)
        if command -v sv &>/dev/null; then
            echo -e "${CYAN}Restarting OmniBrain-AI-Proxy-Smart...${NC}"
            sv restart omnibrain-proxy
        fi
        ;;
    status)
        echo -e "${BOLD}========================================${NC}"
        echo -e "${PURPLE}  OmniBrain-AI-Proxy — Status${NC}"
        echo -e "${BOLD}========================================${NC}"
        if command -v sv &>/dev/null; then
            sv status omnibrain-proxy || echo -e "  Service info: Not configured."
        fi
        echo -e "  Current Dir:   $PROJECT_DIR"
        echo -e "  Runtime:       $(command -v bun || command -v node || echo "None detected")"
        ;;
    logs)
        # Check standard sv log first, then fallback to local log if exists
        LOGFILE="$HOME/.termux/services/omnibrain-proxy/log/current"
        if [ ! -f "$LOGFILE" ]; then
             echo -e "${YELLOW}[INFO]${NC} Service log not found. Watching service script execution..."
             # In some termux-services versions logs aren't captured by default without sv-log
             # We might have a manual server.log in the project root if the user uses nohup
             if [ -f "$PROJECT_DIR/server.log" ]; then
                tail -f "$PROJECT_DIR/server.log"
             else
                echo -e "${RED}[FAIL]${NC} No logs found. Try starting the service first."
             fi
        else
             tail -f "$LOGFILE"
        fi
        ;;
    update)
        echo -e "${CYAN}Updating OmniBrain from GitHub...${NC}"
        # Detect current branch or default to main
        CURRENT_BRANCH=$(git branch --show-current || echo "main")
        git pull origin "$CURRENT_BRANCH"
        if command -v bun &>/dev/null; then
            bun install
        else
            npm install
        fi
        echo -e "${GREEN}[OK]${NC}   Updated successfully. Restart the server for changes."
        ;;
    setup-service)
        bash "$PROJECT_DIR/scripts/setup-service.sh"
        ;;
    env)
        if command -v nano &>/dev/null; then
            nano "$PROJECT_DIR/.env"
        elif command -v vi &>/dev/null; then
            vi "$PROJECT_DIR/.env"
        else
            echo -e "${YELLOW}Editing file: $PROJECT_DIR/.env${NC}"
            cat "$PROJECT_DIR/.env"
        fi
        ;;
    version|--version|-version|-v)
        echo "omni CLI v$OMNI_VERSION"
        ;;
    help|--help|-help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
