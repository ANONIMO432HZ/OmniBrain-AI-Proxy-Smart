#!/usr/bin/env bash
# omni.sh — OmniBrain-AI-Proxy-Smart Management CLI (Professional Version)
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" && pwd)"
cd "$PROJECT_DIR"

# Load shared library (Single Source of Truth)
if [ -f "$PROJECT_DIR/scripts/lib.sh" ]; then
    source "$PROJECT_DIR/scripts/lib.sh"
fi

# Fallback values (Single Source of Truth is in lib.sh)
OMNI_VERSION="${OMNI_VERSION:-1.2.2}"
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
    echo "  start        Start proxy (Background by default)"
    echo "  start:fg     Start proxy in Foreground (Debug)"
    echo "  stop         Stop the background proxy and clean-up"
    echo "  restart      Restart the proxy service"
    echo "  status       Show comprehensive status & version"
    echo "  logs         View real-time proxy activity logs"
    echo "  ui           Open Dashboard in the browser"
    echo "  update       Update repo, sync CLI & reinstall deps"
    echo "  env          Edit .env configuration file"
    echo "  uninstall    Completely remove CLI and/or Proxy"
    echo "  v|version    Show version info"
    echo "  help|-h      Show this help message"
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

cmd_start() {
    echo -e "${CYAN}Starting OmniBrain Proxy in background...${NC}"
    # Prevent double starting
    cmd_stop >/dev/null 2>&1 || true
    
    local START_CMD=""
    if command -v bun &>/dev/null; then
        START_CMD="bun run start:bun"
    else
        START_CMD="npm run start:node"
    fi
    
    # Launch using nohup to survive session close
    mkdir -p "$PROJECT_DIR/logs"
    nohup $START_CMD > "$PROJECT_DIR/server.log" 2>&1 &
    
    echo -e "  Waiting for server to initialize (approx. 30s)..."
    sleep 30
    
    if pgrep -f "index.ts" >/dev/null; then
        echo -e "${GREEN}[OK]${NC} Proxy is running in the background."
        # Use OSC 8 hyperlink escape sequence for clickable URL if terminal supports it
        local LINK_URL="http://localhost:3000"
        echo -e "     URL:  \033]8;;$LINK_URL\033\\${BOLD}${CYAN}$LINK_URL${NC}\033]8;;\033\\"
        echo -e "     Logs: ${BOLD}omni logs${NC}"
    else
        echo -e "${RED}[FAIL]${NC} Failed to start. Check server.log"
    fi
}

cmd_start_fg() {
    echo -e "${CYAN}Starting OmniBrain Proxy in foreground...${NC}"
    if command -v bun &>/dev/null; then
        bun run start:bun
    else
        npm run start:node
    fi
}

cmd_stop() {
    echo -e "${YELLOW}Stopping OmniBrain Proxy processes...${NC}"
    
    # Atomic Multi-Session Search: 
    # Identify processes running 'index.ts' whose CWD is this project
    local PIDS=""
    local ALL_CANDIDATES
    ALL_CANDIDATES=$(pgrep -f "index.ts" || echo "")
    
    for pid in $ALL_CANDIDATES; do
        if [ -d "/proc/$pid" ]; then
            local PROC_CWD
            PROC_CWD=$(readlink -f "/proc/$pid/cwd" 2>/dev/null || echo "")
            if [ "$PROC_CWD" = "$PROJECT_DIR" ] && [ "$pid" != "$$" ]; then
                PIDS="$PIDS $pid"
            fi
        fi
    done
    
    if [ -n "$PIDS" ]; then
        echo -e "Cleaning up lingering processes ($PIDS)..."
        kill -9 $PIDS 2>/dev/null || true
    else
        echo -e "No active proxy processes found."
    fi
    echo -e "${GREEN}[OK]${NC} Stopped."
}

cmd_logs() {
    local LOGFILE="$PROJECT_DIR/server.log"
    # Fallback to old path if present
    if [ ! -f "$LOGFILE" ]; then
         LOGFILE="$HOME/.termux/services/omnibrain-proxy/log/current"
    fi
    
    if [ -f "$LOGFILE" ]; then
         tail -f "$LOGFILE"
    else
         echo -e "${RED}[FAIL]${NC} No logs found at $LOGFILE"
         exit 1
    fi
}

cmd_status() {
    show_banner "OmniBrain-AI-Proxy — Status" "$CYAN"
    echo -e "Version: v$OMNI_VERSION"
    echo -e "Project: $PROJECT_DIR"
    
    if pgrep -f "index.ts" >/dev/null; then
        echo -e "Status: ${GREEN}Running${NC}"
    else
        echo -e "Status: ${RED}Stopped${NC}"
    fi
}

cmd_update() {
    cd "$PROJECT_DIR"
    local GIT_ERR_LOG="/tmp/omni_git_err.log"
    [ -d "$PREFIX/tmp" ] && GIT_ERR_LOG="$PREFIX/tmp/omni_git_err.log"

    # Fetch changes without silencing EVERYTHING to allow debugging if it fails
    git fetch --tags --force 2>"$GIT_ERR_LOG" || { 
        echo -e "${RED}[FAIL]${NC} Network/Git error."
        cat "$GIT_ERR_LOG" 2>/dev/null || echo "Check your internet/DNS connection."
        exit 1 
    }
    
    local LOCAL REMOTE
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse @{u})

    if [ "$LOCAL" = "$REMOTE" ]; then
        echo -e "${GREEN}[OK]${NC} Already up-to-date (v$OMNI_VERSION)."
    else
        echo -e "${YELLOW}[UPDATE]${NC} New version found. Syncing repository..."
        
        # Auto-stash local changes (like CRLF cleanups) to allow pull
        git stash push -m "omni-auto-stash" >/dev/null 2>&1 || true
        
        if git pull; then
            git stash pop >/dev/null 2>&1 || true
            
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
            
            local NEW_VERSION
            NEW_VERSION=$(grep OMNI_VERSION "$PROJECT_DIR/scripts/lib.sh" | cut -d'"' -f2 || echo "Updated")
            echo -e "${GREEN}[OK]${NC} Successfully updated to v$NEW_VERSION. Restart for changes."
        else
            echo -e "${RED}[FAIL]${NC} Pull failed. Try: git reset --hard origin/main"
            git stash pop >/dev/null 2>&1 || true
            exit 1
        fi
    fi
}

cmd_env() {
    if command -v nano &>/dev/null; then
        nano "$PROJECT_DIR/.env"
    elif command -v vi &>/dev/null; then
        vi "$PROJECT_DIR/.env"
    else
        echo -e "${YELLOW}Editing file: $PROJECT_DIR/.env${NC}"
        cat "$PROJECT_DIR/.env"
    fi
}

cmd_uninstall() {
    show_banner "OmniBrain — Uninstaller" "$RED"
    echo -e "${YELLOW}[WARNING]${NC} This will remove the 'omni' CLI command and source code if requested."
    read -p "Also delete the source code directory? (y/n): " -n 1 -r
    echo ""
    local DELETE_SRC=$REPLY

    # 1. Stop and cleaning up processes
    echo -e "  Stopping and cleaning up processes..."
    cmd_stop >/dev/null 2>&1 || true

    # 2. Remove symlink
    echo -e "  Removing CLI link from system..."
    rm -f "$PREFIX/bin/omni"

    if [[ $DELETE_SRC =~ ^[Yy]$ ]]; then
        echo "Deleting source directory $PROJECT_DIR..."
        rm -rf "$PROJECT_DIR"
    fi

    echo -e "${GREEN}[OK]${NC} Uninstallation completed."
}

cmd_browse() {
    local URL="http://localhost:3000"
    echo -e "${CYAN}Opening Dashboard...${NC} ($URL)"
    if is_termux; then
        termux-open-url "$URL" 2>/dev/null || echo -e "${YELLOW}[TIP]${NC} Install 'termux-api' for better integration."
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        start "$URL"
    elif command -v xdg-open &>/dev/null; then
        xdg-open "$URL"
    elif command -v open &>/dev/null; then
        open "$URL"
    else
        echo -e "${RED}[FAIL]${NC} Could not detect browser opener. Access manually at: $URL"
    fi
}

# ── Main Entry Point ──
case "${1:-}" in
    install|--install|inst)    cmd_install ;;
    start|--start|strt)      cmd_start   ;;
    start:fg|--start:fg|strt:fg)   cmd_start_fg ;;
    stop|--stop|stp)       cmd_stop    ;;
    restart|--restart|rst)    cmd_stop && cmd_start ;;
    logs|--logs|log)       cmd_logs    ;;
    ui|--ui|open|browse)   cmd_browse  ;;
    status|--status|st)     cmd_status  ;;
    update|--update|up)     cmd_update  ;;
    env|--env|en)        cmd_env     ;;
    uninstall|--uninstall|uninst)  cmd_uninstall ;;
    v|version|-v|--version) echo "omni CLI v$OMNI_VERSION" ;;
    help|--help|h|"")      show_help ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
