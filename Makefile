CLAUDE_TARGET_DIR := $(HOME)/.claude
OPENCODE_TARGET_DIR := $(HOME)/.config/opencode
SOURCES := CLAUDE.md agents commands skills
DIST_OPENCODE := dist/opencode
DIST_CLAUDE := dist/claude-code

.PHONY: help generate generate-opencode generate-claude generate-all
.PHONY: install install-opencode install-claude install-both install-fresh install-merge backup uninstall

help:
	@echo "Generation targets:"
	@echo "  make generate           Generate for default platform (claude)"
	@echo "  make generate-opencode  Generate OpenCode configuration"
	@echo "  make generate-claude    Generate Claude Code configuration"
	@echo "  make generate-all       Generate both platforms"
	@echo ""
	@echo "Installation targets:"
	@echo "  make install            Install Claude Code (default, backward compatible)"
	@echo "  make install-opencode   Generate + install OpenCode to ~/.config/opencode"
	@echo "  make install-claude     Generate + install Claude Code to ~/.claude"
	@echo "  make install-both       Generate + install both platforms"
	@echo "  make install-fresh      Backup existing + clean install (Claude)"
	@echo "  make install-merge      Add missing files only (Claude)"
	@echo ""
	@echo "Utility targets:"
	@echo "  make backup             Backup current ~/.claude"
	@echo "  make uninstall          Remove ~/.claude"

# Generation targets
generate: generate-claude

generate-opencode:
	@echo "Generating OpenCode configuration..."
	@cd generator && bun generate --platform opencode
	@echo "Generated to $(DIST_OPENCODE)/"

generate-claude:
	@echo "Generating Claude Code configuration..."
	@cd generator && bun generate --platform claude-code
	@echo "Generated to $(DIST_CLAUDE)/"

generate-all:
	@echo "Generating all platforms..."
	@cd generator && bun generate --platform all
	@echo "Generated to dist/"

# Installation targets
install: install-claude

install-opencode: generate-opencode
	@echo "Installing OpenCode to $(OPENCODE_TARGET_DIR)..."
	@mkdir -p "$(OPENCODE_TARGET_DIR)"
	@if [ -d "$(DIST_OPENCODE)" ]; then \
		find "$(DIST_OPENCODE)" -type f | while read f; do \
			rel=$${f#$(DIST_OPENCODE)/}; \
			mkdir -p "$(OPENCODE_TARGET_DIR)/$$(dirname $$rel)"; \
			cp "$$f" "$(OPENCODE_TARGET_DIR)/$$rel"; \
		done; \
		echo "Done!"; \
	else \
		echo "Error: $(DIST_OPENCODE) not found. Run 'make generate-opencode' first."; \
		exit 1; \
	fi

install-claude: generate-claude
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
		echo "Error: $(DIST_CLAUDE) not found. Run 'make generate-claude' first."; \
		exit 1; \
	fi

install-both: generate-all install-opencode install-claude
	@echo "Both platforms installed!"

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
