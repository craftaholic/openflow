TARGET_DIR := $(HOME)/.claude
SOURCES := CLAUDE.md agents commands skills

.PHONY: install install-fresh install-merge backup uninstall help

help:
	@echo "Usage:"
	@echo "  make install        Overwrite repo files, keep user files (recommended)"
	@echo "  make install-fresh  Backup existing + clean install"
	@echo "  make install-merge  Add missing files only, never overwrite"
	@echo "  make backup         Backup current ~/.claude"
	@echo "  make uninstall      Remove ~/.claude"

install:
	@echo "Installing to $(TARGET_DIR)..."
	@mkdir -p "$(TARGET_DIR)"
	@for src in $(SOURCES); do \
		find $$src -type f 2>/dev/null | while read f; do \
			mkdir -p "$(TARGET_DIR)/$$(dirname $$f)"; \
			cp "$$f" "$(TARGET_DIR)/$$f"; \
		done; \
	done
	@echo "Done!"

install-fresh: backup install

install-merge:
	@echo "Merging (add missing only)..."
	@mkdir -p "$(TARGET_DIR)"
	@for src in $(SOURCES); do \
		find $$src -type f 2>/dev/null | while read f; do \
			if [ ! -e "$(TARGET_DIR)/$$f" ]; then \
				mkdir -p "$(TARGET_DIR)/$$(dirname $$f)"; \
				cp "$$f" "$(TARGET_DIR)/$$f"; \
				echo "  Added: $$f"; \
			fi; \
		done; \
	done
	@echo "Done!"

backup:
	@if [ -d "$(TARGET_DIR)" ]; then \
		mv "$(TARGET_DIR)" "$(TARGET_DIR).backup.$$(date +%Y%m%d_%H%M%S)"; \
		echo "Backed up to $(TARGET_DIR).backup.*"; \
	fi

uninstall:
	@echo "Removing repo files from $(TARGET_DIR)..."
	@for src in $(SOURCES); do \
		find $$src -type f 2>/dev/null | while read f; do \
			rm -f "$(TARGET_DIR)/$$f" 2>/dev/null && echo "  Removed: $$f"; \
		done; \
		find $$src -type d 2>/dev/null | sort -r | while read d; do \
			rmdir "$(TARGET_DIR)/$$d" 2>/dev/null || true; \
		done; \
	done
	@echo "Done! User files preserved."
