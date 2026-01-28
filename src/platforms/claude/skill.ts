import { bash } from '../../content/skills/bash'
import { cleanarchitecture } from '../../content/skills/clean-architecture'
import { clouddesign } from '../../content/skills/cloud-design'
import { golang } from '../../content/skills/golang'
import { k8sarchitecture } from '../../content/skills/k8s-architecture'
import { python } from '../../content/skills/python'
import { terraform } from '../../content/skills/terraform'
import { typescript } from '../../content/skills/typescript'

export const claudeSkills = {
  bash: { name: bash.name, description: bash.description, instruction: bash.instruction },
  'clean-architecture': { name: cleanarchitecture.name, description: cleanarchitecture.description, instruction: cleanarchitecture.instruction },
  'cloud-design': { name: clouddesign.name, description: clouddesign.description, instruction: clouddesign.instruction },
  golang: { name: golang.name, description: golang.description, instruction: golang.instruction },
  'k8s-architecture': { name: k8sarchitecture.name, description: k8sarchitecture.description, instruction: k8sarchitecture.instruction },
  python: { name: python.name, description: python.description, instruction: python.instruction },
  terraform: { name: terraform.name, description: terraform.description, instruction: terraform.instruction },
  typescript: { name: typescript.name, description: typescript.description, instruction: typescript.instruction },
}
