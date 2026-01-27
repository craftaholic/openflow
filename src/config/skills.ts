import type { SkillConfig } from './types'

export const skills: SkillConfig[] = [
  {
    name: "typescript",
    description: "TypeScript patterns for Node.js backends, testing, and type-safe development. Use when writing TypeScript/Node.js code.",
    contentFile: "content/skills/typescript.md"
  },
  {
    name: "golang",
    description: "Go patterns for backend development, testing, and clean architecture. Use when writing Go code.",
    contentFile: "content/skills/golang.md"
  },
  {
    name: "python",
    description: "Python patterns for backend development, testing, and async programming. Use when writing Python code.",
    contentFile: "content/skills/python.md"
  },
  {
    name: "bash",
    description: "Defensive Bash scripting patterns for reliable automation. Use when writing shell scripts.",
    contentFile: "content/skills/bash.md"
  },
  {
    name: "clean-architecture",
    description: "Clean Architecture principles for maintainable, testable applications. Use when designing application structure or refactoring.",
    contentFile: "content/skills/clean-architecture.md"
  },
  {
    name: "cloud-design",
    description: "Design resilient, scalable multi-cloud architectures with best practices for AWS, Azure, and GCP. Use when creating cloud architecture diagrams, planning cloud infrastructure, or designing cloud migration strategies.",
    contentFile: "content/skills/cloud-design.md"
  },
  {
    name: "k8s-architecture",
    description: "Design and implement production-grade Kubernetes clusters with best practices for reliability, security, and scalability. Use when planning cluster architecture, designing K8s network models, or implementing multi-cluster strategies.",
    contentFile: "content/skills/k8s-architecture.md"
  },
  {
    name: "terraform",
    description: "Terraform patterns for AWS infrastructure. Use when writing IaC for cloud infrastructure.",
    contentFile: "content/skills/terraform.md"
  }
]
