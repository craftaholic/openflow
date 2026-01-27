# Generator

TypeScript tool for generating `src/` directory structure from markdown files.

## Setup

```bash
bun install
```

## Usage

```bash
# Run generator
bun generate

# Development mode (watch)
bun dev

# Build
bun build
```

## Structure

```
generator/
├── src/
│   ├── index.ts       # CLI entry point
│   ├── generate.ts    # Main generation logic
│   └── utils/
│       ├── files.ts   # File operations
│       └── format.ts  # Frontmatter generation
├── package.json
├── tsconfig.json
└── README.md
```

## Development

This tool reads markdown files from `src/platforms/` and generates the corresponding directory structure in `src/`.
