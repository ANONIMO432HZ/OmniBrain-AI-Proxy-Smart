#!/usr/bin/env bash
# omni.sh — OmniBrain-AI-Proxy-Smart Management CLI (Professional Version)
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"

# Load shared library (Single Source of Truth)
if [ -f "$PROJECT_DIR/scripts/lib.sh" ]; then
    source "$PROJECT_DIR/scripts/lib.sh"
fi

# Fallback values (Single Source of Truth is in lib.sh)
OMNI_VERSION="${OMNI_VERSION:-1.2.0}"
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
    echo "  install      All-in-one installation & integration"
    echo "  start        Start proxy (Standard & Auto-Daemon)"
    echo "  stop         Stop the background proxy and clean-up"
    echo "  restart      Restart the proxy service"
    echo "  status       Show comprehensive status & version"
    echo "  logs         View real-time proxy activity logs"
    echo "  update       Update repo, sync CLI & reinstall deps"
    echo "  env          Edit .env configuration file"
    echo "  uninstall    Completely remove CLI and/or Proxy"
    echo "  v|version|-v Show version info"
    echo "  help|-help|-h      Show this help message"
    echo ""
}

# ── Command Implementations ──
cmd_install() {
    show_banner "OmniBrain — One-Click Installer" "$CYAN"
    
    echo -e "1. Checking and installing system dependencies..."
    if is_termux; then
        echo "Detected Termux. Ensuring nodejs-lts and nano are present..."
        pkg update && pkg install -y nodejs-lts nano 2>/dev/null || {
            echo -e "${RED}[WARN]${NC} System update failed. Attempting to proceed..."
        }
    fi

    echo -e "\n2. Integrating CLI into system..."
    
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

    echo -e "\n3. Installing project dependencies (NPM)..."
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

    # 1. Stop and cleaning up processes
    echo -e "  Stopping and cleaning up processes..."
    $0 stop >/dev/null 2>&1 || true

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
        echo -e "${CYAN}Starting OmniBrain Proxy in foreground...${NC}"
        if command -v bun &>/dev/null; then
            bun run start:bun
        else
            npm run start:node
        fi
        ;;
    --stop|-stop|stop)
        echo -e "${YELLOW}Stopping OmniBrain Proxy processes...${NC}"
        
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
        $0 stop
        $0 start
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
        echo -e "Version: v$OMNI_VERSION"
        echo -e "Project: $PROJECT_DIR"
        ;;
    --update|-update|update)
        echo -e "${CYAN}Checking for updates...${NC}"
        git fetch >/dev/null 2>&1 || { echo -e "${RED}[FAIL]${NC} Network error."; exit 1; }
        
        LOCAL=$(git rev-parse HEAD)
        REMOTE=$(git rev-parse @{u})

        if [ "$LOCAL" = "$REMOTE" ]; then
            echo -e "${GREEN}[OK]${NC} Already up-to-date (v$OMNI_VERSION)."
        else
            echo -e "${YELLOW}[UPDATE]${NC} New version found. Downloading..."
            git pull
            
            # Refresh CLI and clean endings
            find "$PROJECT_DIR" -maxdepth 2 -name "*.sh" -exec sed -i 's/\r$//' {} + 2>/dev/null || true
            if [ -w "$PREFIX/bin" ]; then
                ln -sf "$PROJECT_DIR/omni.sh" "$PREFIX/bin/omni"
                chmod +x "$PROJECT_DIR/omni.sh"
            fi

            if command -v bun &>/dev/null; then
                bun install
            else
                npm install
            fi
            echo -e "${GREEN}[OK]${NC} Successfully updated. Restart the server for changes."
        fi
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
    v|--version|-version|version|-v)
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
