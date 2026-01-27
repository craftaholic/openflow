CLAUDE_TARGET_DIR := $(HOME)/.claude
SOURCES := CLAUDE.md agents commands skills
DIST_CLAUDE := dist/claude-code

.PHONY: install generate help install-fresh install-merge backup uninstall

# Default target - install
install: generate
	@echo "Installing Claude Code to $(CLAUDE_TARGET_DIR)..."
	@mkdir -p "$(CLAUDE_TARGET_DIR)"
	@if [ -d "$(DIST_CLAUDE)" ]; then \
		find "$(DIST_CLAUDE)" -type f | while read f; do \
			rel=$${f#$(DIST_CLAUDE)/}; \
			mkdir -p "$(CLAUDE_TARGET_DIR)/$$(dirname $$rel)"; \
			cp "$$f" "$(CLAUDE_TARGET_DIR)/$$rel"; \
		done; \
		echo "Done!"; \
	else \
		echo "Error: $(DIST_CLAUDE) not found. Run 'make generate' first."; \
		exit 1; \
	fi

generate:
	@echo "Generating Claude Code configuration..."
	@cd generator && bun generate --platform claude-code
	@echo "Generated to dist/claude-code/"

help:
	@echo "OpenFlow - Claude Code Configuration"
	@echo ""
	@echo "Core targets:"
	@echo "  make           Install Claude Code (default)"
	@echo "  make install   Install Claude Code"
	@echo "  make generate  Generate configuration files"
	@echo ""
	@echo "Utility targets:"
	@echo "  make backup    Backup ~/.claude"
	@echo "  make uninstall Remove ~/.claude"
	@echo ""
	@echo "Advanced options (see README.md):"
	@echo "  make install-fresh   Backup + clean install"
	@echo "  make install-merge   Add missing files only"

install-fresh: backup install

install-merge:
	@echo "Merging (add missing only)..."
	@mkdir -p "$(CLAUDE_TARGET_DIR)"
	@for src in $(SOURCES); do \
		find $$src -type f 2>/dev/null | while read f; do \
			if [ ! -e "$(CLAUDE_TARGET_DIR)/$$f" ]; then \
				mkdir -p "$(CLAUDE_TARGET_DIR)/$$(dirname $$f)"; \
				cp "$$f" "$(CLAUDE_TARGET_DIR)/$$f"; \
				echo "  Added: $$f"; \
			fi; \
		done; \
	done
	@echo "Done!"

backup:
	@if [ -d "$(CLAUDE_TARGET_DIR)" ]; then \
		mv "$(CLAUDE_TARGET_DIR)" "$(CLAUDE_TARGET_DIR).backup.$$(date +%Y%m%d_%H%M%S)"; \
		echo "Backed up to $(CLAUDE_TARGET_DIR).backup.*"; \
	fi

uninstall:
	@echo "Removing repo files from $(CLAUDE_TARGET_DIR)..."
	@for src in $(SOURCES); do \
		find $$src -type f 2>/dev/null | while read f; do \
			rm -f "$(CLAUDE_TARGET_DIR)/$$f" 2>/dev/null && echo "  Removed: $$f"; \
		done; \
		find $$src -type d 2>/dev/null | sort -r | while read d; do \
			rmdir "$(CLAUDE_TARGET_DIR)/$$d" 2>/dev/null || true; \
		done; \
	done
	@echo "Done! User files preserved."
