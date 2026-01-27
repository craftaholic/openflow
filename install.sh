#!/usr/bin/env bash
set -euo pipefail

# Wrapper for curl | bash support - ensures entire script is downloaded first
{
# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
NO_GENERATE=false
DRY_RUN=false
PLATFORM=""
FORCE=false
REPO_URL="${OPENFLOW_REPO_URL:-https://github.com/craftaholic/claude-orchestrator.git}"
INSTALL_DIR=""

# Detect if running via curl | bash (non-interactive pipe mode)
is_piped() {
    [ ! -t 0 ]
}

# Clone repo if running via curl | bash
setup_repo() {
    local target_dir="$1"
    local repo_url="$2"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would clone: $repo_url -> $target_dir"
        return 0
    fi

    if [ -d "$target_dir/.git" ]; then
        echo "Updating existing repository..."
        cd "$target_dir"
        git pull origin main --quiet 2>/dev/null || git pull --quiet || true
    else
        echo "Cloning repository..."
        git clone "$repo_url" "$target_dir"
        cd "$target_dir"
    fi
}

# Usage function
usage() {
    cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Install OpenFlow skills to OpenCode and/or Claude Code.

Options:
    --help                  Show this help message
    --dry-run               Show what would be done without doing it
    --no-generate           Skip running 'make generate' before installation
    --platform PLATFORM     Specify platform: opencode, claude-code, or both
    --force                 Install even if platform not detected

Environment Variables:
    OPENFLOW_REPO_URL       Git repository URL (for curl | bash install)
    OPENFLOW_INSTALL_DIR    Installation directory (default: current directory)

Examples:
    $(basename "$0")                           # Auto-detect and install
    $(basename "$0") --platform opencode       # Install to OpenCode only
    $(basename "$0") --no-generate             # Skip generation step
    $(basename "$0") --dry-run                 # Preview installation

Remote Install:
    curl -sSL https://raw.githubusercontent.com/craftaholic/claude-orchestrator/main/install.sh | bash

EOF
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --help)
            usage
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --no-generate)
            NO_GENERATE=true
            shift
            ;;
        --platform)
            PLATFORM="$2"
            shift 2
            ;;
        --force)
            FORCE=true
            shift
            ;;
        *)
            echo -e "${RED}Error: Unknown option: $1${NC}" >&2
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Handle curl | bash mode - clone repo if running via pipe and not in project directory
if is_piped; then
    # Determine install directory
    INSTALL_DIR="${OPENFLOW_INSTALL_DIR:-${HOME}/.openflow-install}"

    # Check if we're in a valid repo (generator/ and dist/ exist)
    if [ ! -d "generator" ] || [ ! -d "dist" ]; then
        echo -e "${GREEN}Running in remote install mode...${NC}"

        # Setup repository
        setup_repo "$INSTALL_DIR" "$REPO_URL"

        # Run install from the cloned repo
        cd "$INSTALL_DIR"

        # Re-parse arguments in the cloned repo context
        export NO_GENERATE
        export DRY_RUN
        export PLATFORM
        export FORCE

        exec ./install.sh "$@"
    fi
fi

# Validate platform argument
if [ -n "$PLATFORM" ] && [ "$PLATFORM" != "opencode" ] && [ "$PLATFORM" != "claude-code" ] && [ "$PLATFORM" != "both" ]; then
    echo -e "${RED}Error: Invalid platform '$PLATFORM'. Must be: opencode, claude-code, or both${NC}" >&2
    exit 1
fi

# Detect platforms
HAS_OPENCODE=false
HAS_CLAUDE=false

if [ -d "$HOME/.config/opencode" ] || command -v opencode &> /dev/null; then
    HAS_OPENCODE=true
fi

if [ -d "$HOME/.claude" ] || command -v claude &> /dev/null; then
    HAS_CLAUDE=true
fi

# Determine what to install
INSTALL_OPENCODE=false
INSTALL_CLAUDE=false

if [ -n "$PLATFORM" ]; then
    # Platform explicitly specified
    case $PLATFORM in
        opencode)
            INSTALL_OPENCODE=true
            if [ "$HAS_OPENCODE" = false ] && [ "$FORCE" = false ]; then
                echo -e "${RED}Error: OpenCode not detected. Use --force to install anyway.${NC}" >&2
                exit 1
            fi
            ;;
        claude-code)
            INSTALL_CLAUDE=true
            if [ "$HAS_CLAUDE" = false ] && [ "$FORCE" = false ]; then
                echo -e "${RED}Error: Claude Code not detected. Use --force to install anyway.${NC}" >&2
                exit 1
            fi
            ;;
        both)
            INSTALL_OPENCODE=true
            INSTALL_CLAUDE=true
            if [ "$HAS_OPENCODE" = false ] && [ "$HAS_CLAUDE" = false ] && [ "$FORCE" = false ]; then
                echo -e "${RED}Error: Neither OpenCode nor Claude Code detected. Use --force to install anyway.${NC}" >&2
                exit 1
            fi
            ;;
    esac
else
    # Auto-detect
    if [ "$HAS_OPENCODE" = true ]; then
        INSTALL_OPENCODE=true
    fi
    if [ "$HAS_CLAUDE" = true ]; then
        INSTALL_CLAUDE=true
    fi
    
    if [ "$INSTALL_OPENCODE" = false ] && [ "$INSTALL_CLAUDE" = false ]; then
        echo -e "${RED}Error: Neither OpenCode nor Claude Code detected.${NC}" >&2
        echo "Please install one of them first, or use --platform to specify explicitly."
        exit 1
    fi
fi

# Check if generator exists
if [ ! -d "generator" ]; then
    echo -e "${RED}Error: generator/ directory not found. Are you in the project root?${NC}" >&2
    exit 1
fi

# Run generation step
if [ "$NO_GENERATE" = false ]; then
    echo -e "${GREEN}Running 'make generate'...${NC}"
    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would run: make generate"
    else
        make generate
    fi
else
    echo -e "${YELLOW}Skipping generation step (--no-generate)${NC}"
fi

# Check if dist/ exists
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: dist/ directory not found. Generation may have failed.${NC}" >&2
    exit 1
fi

# Install function
install_platform() {
    local platform=$1
    local dist_dir="dist/$platform"
    local target_dir=""
    
    case $platform in
        opencode)
            target_dir="$HOME/.config/opencode/skills"
            ;;
        claude-code)
            target_dir="$HOME/.claude/skills"
            ;;
    esac
    
    if [ ! -d "$dist_dir" ]; then
        echo -e "${RED}Error: $dist_dir not found. Generation may have failed.${NC}" >&2
        return 1
    fi
    
    echo -e "${GREEN}Installing to $platform ($target_dir)...${NC}"
    
    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would create: $target_dir"
        echo "[DRY RUN] Would copy: $dist_dir/* -> $target_dir/"
        
        # Show what would be copied
        if [ -d "$dist_dir" ]; then
            echo "[DRY RUN] Files to copy:"
            find "$dist_dir" -type f | sed "s|$dist_dir/|  - |"
        fi
    else
        # Create target directory
        mkdir -p "$target_dir"
        
        # Copy all files from dist/{platform}/ to target
        # This preserves the subdirectory structure (e.g., terraform/, python/, etc.)
        cp -r "$dist_dir"/* "$target_dir/"
        
        echo -e "${GREEN}✓ Installed successfully to $target_dir${NC}"
    fi
}

# Perform installation
if [ "$INSTALL_OPENCODE" = true ]; then
    install_platform "opencode"
fi

if [ "$INSTALL_CLAUDE" = true ]; then
    install_platform "claude-code"
fi

# Summary
echo ""
if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}=== DRY RUN COMPLETE ===${NC}"
    echo "No files were modified. Run without --dry-run to perform installation."
else
    echo -e "${GREEN}=== INSTALLATION COMPLETE ===${NC}"
    if [ "$INSTALL_OPENCODE" = true ]; then
        echo "✓ OpenCode skills installed"
    fi
    if [ "$INSTALL_CLAUDE" = true ]; then
        echo "✓ Claude Code skills installed"
    fi
fi

} # end of curl | bash wrapper
