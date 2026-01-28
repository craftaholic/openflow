import type { Skill } from '../../interfaces/skill'

export const bash: Skill = {
  name: "bash",
  description: "Defensive shell scripting patterns",
  instruction: `# Bash

## Defensive Scripting

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

name="${'$'}{1:-}"
output="${'$'}{2:-output.txt}"

if [[ -z "$name" ]]; then
    echo "Usage: $0 <name> [output]" >&2
    exit 1
fi

if [[ ! "$name" =~ ^[a-zA-Z_]+$ ]]; then
    echo "Error: name must contain only letters and underscores" >&2
    exit 1
fi
\`\`\`

## Functions

\`\`\`bash
log() {
    local level="$1"
    local message="$2"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message"
}

find_config() {
    local file
    for dir in /etc/myapp "$HOME/.myapp" .; do
        file="$dir/config.yml"
        if [[ -f "$file" ]]; then
            echo "$file"
            return 0
        fi
    done
    return 1
}

config=$(find_config)
if [[ -z "$config" ]]; then
    log "ERROR" "No config file found"
    exit 1
fi
\`\`\`

## Array/Map Operations

\`\`\`bash
declare -A config
config[host]="localhost"
config[port]="8080"
config[env]="development"

for key in "${'$'}{!config[@]}"; do
    echo "$key=${'$'}{config[$key]}"
done

# Process arguments as array
args=("$@")
for i in "${'$'}{!args[@]}"; do
    echo "arg $i: ${'$'}{args[$i]}"
done
\`\`\`

## Error Handling

\`\`\`bash
run_with_retry() {
    local max_attempts=3
    local delay=5
    local attempt=1

    while (( attempt <= max_attempts )); do
        if "$@"; then
            return 0
        fi
        echo "Attempt $attempt failed, retrying in $delay seconds..." >&2
        sleep "$delay"
        ((attempt++))
    done
    echo "Failed after $max_attempts attempts" >&2
    return 1
}

cleanup() {
    echo "Cleaning up..."
    rm -rf "$tmpdir"
}
trap cleanup EXIT
tmpdir=$(mktemp -d)
\`\`\`

## Safe Command Execution

\`\`\`bash
require_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "Error: $1 is required but not installed." >&2
        exit 1
    fi
}

set -e
(
    cd /tmp
    ./build-script.sh
) || {
    echo "Build failed, but continuing..."
}

set -o pipefail
result=$(complex_pipeline) || {
    echo "Pipeline failed with exit code $?"
    exit 1
}
\`\`\`

## File Operations

\`\`\`bash
write_config() {
    local content="$1"
    local target="$2"
    local tmp="${'$'}{target}.tmp.$$"

    echo "$content" > "$tmp"
    if [[ -f "$target" ]]; then
        mv "$tmp" "$target"
    else
        mv "$tmp" "$target"
    fi
}

while IFS= read -r line || [[ -n "$line" ]]; do
    echo "Processing: $line"
done < "$input_file"
\`\`\`

## Best Practices

- Always set -euo pipefail
- Quote all variable expansions
- Use local in functions
- Use [[ ]] over [ ]
- Prefer printf over echo
- Use command -v for checks
- Return values via stdout
- Trap EXIT for cleanup
- Avoid eval
- Use #!/usr/bin/env bash
`
}
