#!/usr/bin/env bash
# omni.sh — OmniBrain-AI-Proxy-Smart Management CLI (Professional Version)
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
    echo "  --install|-install|install      All-in-one installation & integration"
    echo "  --start|-start|start          Start proxy (Background/Manual options)"
    echo "  --start:manual|start:manual     Force foreground execution (Debug)"
    echo "  --stop|-stop|stop           Stop the background proxy and clean-up"
    echo "  --restart|-restart|restart      Restart the proxy service"
    echo "  --status|-status|status         Show comprehensive status & version"
    echo "  --logs|-logs|logs           View real-time proxy activity logs"
    echo "  --update|-update|update         Update from GitHub & reinstall deps"
    echo "  --setup-service|setup-service   Configure as a persistent Termux service"
    echo "  --env|-env|env            Edit .env configuration file"
    echo "  --uninstall|uninstall           Completely remove CLI and/or Proxy"
    echo "  --version|-version|version|-v   Show version info"
    echo "  --help|-help|help|-h        Show this help message"
    echo ""
}

# ── Command Implementations ──
cmd_install() {
    show_banner "OmniBrain — One-Click Installer" "$CYAN"
    
    echo -e "1. Integrating CLI into system..."
    
    # Self-clean CRLF line endings (Windows to Linux fix)
    find "$PROJECT_DIR" -maxdepth 2 -name "*.sh" -exec sed -i 's/\r$//' {} + 2>/dev/null || true
    
    if [ -w "$PREFIX/bin" ]; then
        rm -f "$PREFIX/bin/omni"
        ln -s "$PROJECT_DIR/omni.sh" "$PREFIX/bin/omni"
        chmod +x "$PROJECT_DIR/omni.sh"
        echo -e "${GREEN}[OK]${NC} Command 'omni' created in $PREFIX/bin."
    else
        echo -e "${RED}[FAIL]${NC} No write permission in $PREFIX/bin."
    fi

    echo -e "\n2. Installing dependencies..."
    if command -v bun &>/dev/null; then
        echo "Using Bun for installation (Priority)..."
        bun install
    else
        echo "Using NPM for installation..."
        npm install
    fi
    echo -e "${GREEN}[OK]${NC} Dependencies ready."

    echo -e "\n3. Configuring environment..."
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        if [ -f "$PROJECT_DIR/.env.example" ]; then
            cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
            echo -e "${YELLOW}[INFO]${NC} Created .env from example. Don't forget to edit it!"
        fi
    fi

    echo -e "\n${BOLD}${GREEN}Installation Complete!${NC}"
    echo -e "You can now run ${BOLD}omni start${NC} from anywhere."
}

cmd_uninstall() {
    show_banner "OmniBrain — Uninstaller" "$RED"
    echo -e "${YELLOW}[WARNING]${NC} This will remove the 'omni' CLI command and background services."
    read -p "Also delete the source code directory? (y/n): " -n 1 -r
    echo ""
    local DELETE_SRC=$REPLY

    # 1. Stop and disable service using our optimized stop logic
    echo -e "  Stopping and cleaning up processes..."
    $0 stop >/dev/null 2>&1 || true
    
    if command -v sv &>/dev/null; then
        sv-disable omnibrain-proxy 2>/dev/null || true
    fi

    # 2. Remove symlink
    echo -e "  Removing CLI link from system..."
    rm -f "$PREFIX/bin/omni"

    if [[ $DELETE_SRC =~ ^[Yy]$ ]]; then
        echo "Deleting source directory $PROJECT_DIR..."
        rm -rf "$PROJECT_DIR"
    fi

    echo -e "${GREEN}[OK]${NC} Uninstallation completed."
}

# ── Main Entry Point ──
case "${1:-}" in
    --install|-install|install)
        cmd_install
        ;;
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
                exit 1
            }
        else
            echo -e "${YELLOW}[INFO]${NC} termux-services not installed. Falling back to [Option 2]..."
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
            sleep 1
        fi
        
        # Infallible Search: Catch any process running within the project directory
        # Excludes self PID ($$) to avoid accidental closure of the CLI itself
        local PIDS
        PIDS=$(pgrep -f "$PROJECT_DIR" | grep -v "$$" || echo "")
        
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
        show_banner "OmniBrain-AI-Proxy — Status" "$CYAN"
        if command -v sv &>/dev/null; then
            sv status omnibrain-proxy || echo -e "  Service info: Not configured."
        fi
        echo -e "Version: v$OMNI_VERSION"
        echo -e "Project: $PROJECT_DIR"
        ;;
    --update|-update|update)
        echo -e "${CYAN}Updating OmniBrain-AI-Proxy-Smart...${NC}"
        git pull
        find "$PROJECT_DIR" -maxdepth 2 -name "*.sh" -exec sed -i 's/\r$//' {} + 2>/dev/null || true
        
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
    --uninstall|-uninstall|uninstall)
        cmd_uninstall
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
