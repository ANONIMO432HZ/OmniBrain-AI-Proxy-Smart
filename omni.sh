#!/usr/bin/env bash
# omni.sh — OmniBrain-AI-Proxy-Smart Management CLI
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"

# Load shared library (Single Source of Truth)
if [ -f "$PROJECT_DIR/scripts/lib.sh" ]; then
    source "$PROJECT_DIR/scripts/lib.sh"
fi

# Fallback values (Single Source of Truth is in lib.sh)
OMNI_VERSION="${OMNI_VERSION:-1.0.1}"
RED="${RED:-\033[0;31m}"
GREEN="${GREEN:-\033[0;32m}"
YELLOW="${YELLOW:-\033[1;33m}"
BLUE="${BLUE:-\033[0;34m}"
PURPLE="${PURPLE:-\033[0;35m}"
CYAN="${CYAN:-\033[0;36m}"
BOLD="${BOLD:-\033[1m}"
NC="${NC:-\033[0m}"

show_help() {
    show_banner "OmniBrain Proxy Professional CLI" "$CYAN"
    echo "Usage: omni [command]"
    echo ""
    echo "Commands:"
    echo "  --start|-start|start          Start proxy in background (Termux service)"
    echo "  --start:manual|start:manual     Start proxy in foreground for debugging"
    echo "  --stop|-stop|stop           Stop the background proxy"
    echo "  --restart|-restart|restart      Restart the proxy"
    echo "  --status|-status|status         Show proxy service status"
    echo "  --logs|-logs|logs           View live proxy logs"
    echo "  --update|-update|update         Update the API (git pull + npm install)"
    echo "  --setup-service|setup-service   Configure as a Termux background service"
    echo "  --env|-env|env            Edit .env configuration file"
    echo "  --version|-version|version|-v   Show version information"
    echo "  --help|-help|help|-h        Show this help message"
    echo ""
}

case "${1:-}" in
    --start|-start|start)
        show_banner "OmniBrain Proxy - Start Options" "$CYAN"
        
        echo -e "${CYAN}[Option 1: Background Service (Recommended)]${NC}"
        echo -e "  - Description: Runs as a persistent daemon via termux-services."
        echo -e "  - Benefits: Auto-restart on crash, survives SSH disconnect, auto-start on boot."
        echo -e "  - Usage: ${BOLD}omni start${NC}"
        echo -e ""
        echo -e "${YELLOW}[Option 2: Foreground Manual (Fast Debug)]${NC}"
        echo -e "  - Description: Runs directly in your current terminal session."
        echo -e "  - Benefits: Instant log output, close with Ctrl+C, best for quick debugging."
        echo -e "  - Usage: ${BOLD}omni start:manual${NC}"
        echo -e ""
        echo -e "${BOLD}-----------------------------------------${NC}"
        
        if command -v sv &>/dev/null; then
            echo -e "${GREEN}Executing [Option 1] now...${NC}"
            sv start omnibrain-proxy || { 
                echo -e "${RED}[FAIL]${NC} Background service not found."
                echo -e "Run: ${CYAN}omni setup-service${NC} to enable persistent background mode."
                echo -e "Or run: ${YELLOW}omni start:manual${NC} for manual mode."
                exit 1; 
            }
        else
            echo -e "${YELLOW}[INFO]${NC} termux-services not installed. Falling back to [Option 2]...${NC}"
            $0 start:manual
        fi
        ;;
    --start:manual|start:manual)
        echo -e "${YELLOW}Running OmniBrain Proxy directly (Foreground)...${NC}"
        if command -v bun &>/dev/null; then
            bun run start:bun
        else
            npm run start:node
        fi
        ;;
    --stop|-stop|stop)
        if command -v sv &>/dev/null; then
            echo -e "${YELLOW}Stopping OmniBrain-AI-Proxy-Smart...${NC}"
            sv stop omnibrain-proxy || true
        fi
        # Fallback cleanup
        local PIDS
        PIDS=$(pgrep -f "node.*omnibrain-proxy" || echo "")
        if [ -n "$PIDS" ]; then
            echo -e "Cleaning up lingering processes ($PIDS)..."
            kill -9 $PIDS 2>/dev/null || true
        fi
        echo -e "${GREEN}[OK]${NC} Stopped."
        ;;
    --restart|-restart|restart)
        if command -v sv &>/dev/null; then
            echo -e "${CYAN}Restarting OmniBrain-AI-Proxy-Smart...${NC}"
            sv restart omnibrain-proxy
        fi
        ;;
    --logs|-logs|logs)
        local LOGFILE="$HOME/.termux/services/omnibrain-proxy/log/current"
        if [ ! -f "$LOGFILE" ]; then
             # Standard location if sv-log is not used
             LOGFILE="$PROJECT_DIR/server.log"
        fi
        
        if [ -f "$LOGFILE" ]; then
             tail -f "$LOGFILE"
        else
             echo -e "${RED}[FAIL]${NC} No logs found."
             exit 1
        fi
        ;;
    --status|-status|status)
        show_banner "OmniBrain-AI-Proxy — Status" "$PURPLE"
        if command -v sv &>/dev/null; then
            sv status omnibrain-proxy || echo -e "  Service info: Not configured."
        fi
        echo -e "Version: v$OMNI_VERSION"
        echo -e "Project: $PROJECT_DIR"
        ;;
    --update|-update|update)
        echo -e "${CYAN}Updating OmniBrain-AI-Proxy-Smart...${NC}"
        git pull
        if command -v bun &>/dev/null; then
            bun install
        else
            npm install
        fi
        echo -e "${GREEN}[OK]${NC}   Updated successfully. Restart the server for changes."
        ;;
    --setup-service|-setup-service|setup-service)
        bash "$PROJECT_DIR/scripts/setup-service.sh"
        ;;
    --env|-env|env)
        if command -v nano &>/dev/null; then
            nano "$PROJECT_DIR/.env"
        elif command -v vi &>/dev/null; then
            vi "$PROJECT_DIR/.env"
        else
            echo -e "${YELLOW}Editing file: $PROJECT_DIR/.env${NC}"
            cat "$PROJECT_DIR/.env"
        fi
        ;;
    --version|-version|version|-v)
        echo "omni CLI v$OMNI_VERSION"
        ;;
    --help|-help|help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
