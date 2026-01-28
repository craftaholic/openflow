import type { Skill } from '../../interfaces/skill'

export const terraform: Skill = {
  name: "terraform",
  description: "Terraform patterns for AWS infrastructure",
  instruction: `# Terraform

## Module Structure

\`\`\`hcl
modules/
├── main.tf              # Main resources
├── variables.tf         # Input variables
├── outputs.tf           # Output values
├── providers.tf         # Provider configuration
├── locals.tf            # Local values
└── versions.tf          # Provider versions
\`\`\`

## Provider Configuration

\`\`\`hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
\`\`\`

## Variables and Outputs

\`\`\`hcl
variable "environment" {
  description = "Deployment environment"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Must be dev, staging, or prod"
  }
}

variable "instance_config" {
  description = "EC2 instance configuration"
  type = object({
    instance_type = string
    ami_id        = string
    volume_size   = number
  })
  default = {
    instance_type = "t3.micro"
    ami_id        = "ami-0c02fb55956c7d316"
    volume_size   = 20
  }
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.app.id
  sensitive   = false
}

output "instance_ip" {
  description = "EC2 instance public IP"
  value       = aws_instance.app.public_ip
  sensitive   = false
}
\`\`\`

## Resource Patterns

EC2 with IAM Role:

\`\`\`hcl
resource "aws_iam_role" "app_role" {
  name = "\${var.environment}-app-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_instance_profile" "app_profile" {
  name = "\${var.environment}-app-profile"
  role = aws_iam_role.app_role.name
}

resource "aws_instance" "app" {
  ami                    = var.instance_config.ami_id
  instance_type          = var.instance_config.instance_type
  iam_instance_profile   = aws_iam_instance_profile.app_profile.name

  ebs_block_device {
    device_name = "/dev/sda1"
    volume_size = var.instance_config.volume_size
    encrypted   = true
  }

  tags = {
    Name        = "\${var.environment}-app"
    Environment = var.environment
  }
}
\`\`\`

Security Group:

\`\`\`hcl
resource "aws_security_group" "app_sg" {
  name        = "\${var.environment}-app-sg"
  description = "Security group for app"
  vpc_id      = var.vpc_id

  dynamic "ingress" {
    for_each = [
      { port = 80, desc = "HTTP" },
      { port = 443, desc = "HTTPS" },
      { port = 22, desc = "SSH" }
    ]
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = "tcp"
      cidr_blocks = var.allowed_cidrs
      description = ingress.value.desc
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
\`\`\`

## Data Sources

\`\`\`hcl
data "aws_vpc" "main" {
  default = true
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

data "aws_caller_identity" "current" {}
\`\`\`

## State Management

\`\`\`hcl
data "terraform_remote_state" "network" {
  backend = "s3"

  config = {
    bucket = "my-terraform-state"
    key    = "network/terraform.tfstate"
    region = "us-east-1"
  }
}

resource "aws_instance" "app" {
  subnet_id = data.terraform_remote_state.network.outputs.subnet_id
}
\`\`\`

## Dynamic Blocks

\`\`\`hcl
resource "aws_security_group_rule" "app_rules" {
  for_each = var.ingress_rules

  type              = "ingress"
  from_port         = each.value.port
  to_port           = each.value.port
  protocol          = each.value.protocol
  cidr_blocks       = each.value.cidrs
  security_group_id = aws_security_group.app.id
}
\`\`\`

## Terragrunt Pattern

\`\`\`hcl
terraform {
  source = "git::https://github.com/org/infrastructure-modules//app?ref=v1.0.0"
}

inputs = {
  environment = "prod"
  instance_config = {
    instance_type = "t3.medium"
    ami_id        = "ami-0c02fb55956c7d316"
  }
}

remote_state {
  backend = "s3"
  config = {
    bucket = "my-terragrunt-state"
    key    = "\${path_relative_to_include()}/terraform.tfstate"
    region = "us-east-1"
  }
}
\`\`\`

## Testing

\`\`\`hcl
locals {
  test_ami = "ami-0c02fb55956c7d316"
}

module "test_instance" {
  source = "./"

  instance_config = {
    instance_type = local.test_ami
    ami_id        = "t3.micro"
    volume_size   = 20
  }
}

resource "test_assertions" "instance" {
  component = "ec2_instance"

  check "has_id" {
    condition     = length(module.test_instance.instance_id) > 0
    error_message = "Instance ID should be set"
  }
}
\`\`\`

## Best Practices

- Use remote state with locking (S3 + DynamoDB)
- Pin provider versions
- Use modules for reusability
- Implement workspaces or folders for environments
- Use terraform plan before apply
- Enable state encryption
- Use --auto-approve only in CI/CD with checks
- Implement policy as code (OPA)
- Use terraform console for debugging
- Document variables with descriptions
- Use lifecycle blocks to prevent destruction
- Keep state secure, never commit to git
`
}
