import type { Skill } from '../../interfaces/skill'

export const clouddesign: Skill = {
  name: "cloud-design",
  description: "Multi-cloud architecture patterns for AWS, Azure, GCP",
  instruction: `# Cloud Design

## Architecture Principles

### Design for Failure
- Assume any component can fail
- Implement redundancy at every layer
- Use managed services for critical paths
- Design for graceful degradation

### Elasticity
- Scale horizontally, not vertically
- Use auto-scaling groups
- Implement health checks and circuit breakers
- Decouple components with queues/topics

### Security in Depth
- Defense at each layer
- Principle of least privilege
- Encrypt everything at rest and in transit
- Centralized identity management

## Multi-Cloud Patterns

\`\`\`yaml
provider:
  cloud: multi
  region: ${"${"}env.REGION || "us-east-1"}

resources:
  database:
    type: cloud-agnostic
    engine: postgresql
    ha: true
    backup: 24h

  compute:
    type: cloud-specific
    providers:
      aws:
        instance: t3.medium
        asg: true
      azure:
        vm_size: Standard_B2s
        scale_set: true
      gcp:
        machine_type: e2-medium
        mig: true
\`\`\`

## Microservices Communication

Synchronous (REST/gRPC):

\`\`\`typescript
interface ServiceClient {
  call(method: string, request: unknown): Promise<unknown>
}

class ResilientClient implements ServiceClient {
  constructor(
    private baseUrl: string,
    private httpClient: HttpClient
  ) {}

  async call(method: string, request: unknown): Promise<unknown> {
    return this.httpClient.post("${'$'}{this.baseUrl}/${'$'}{method}", request, {
      timeout: 5000,
      retry: { maxAttempts: 3, backoff: 'exponential' },
      circuitBreaker: { failureThreshold: 5, resetTimeout: 30000 }
    })
  }
}
\`\`\`

Asynchronous (Event-Driven):

\`\`\`typescript
class UserEventPublisher {
  constructor(private eventBus: EventBus) {}

  async publish(event: UserEvent): Promise<void> {
    await this.eventBus.publish({
      topic: 'user.events',
      payload: event,
      attributes: {
        correlationId: event.userId,
        timestamp: new Date().toISOString()
      }
    })
  }
}

class UserEventHandler {
  @EventHandler('user.created')
  async handleCreated(event: UserCreatedEvent): Promise<void> {
    await this.processWithRetry(() => this.sendWelcomeEmail(event))
  }

  private async processWithRetry(fn: () => Promise<void>): Promise<void> {
    const maxAttempts = 3
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await fn()
        return
      } catch (error) {
        if (i === maxAttempts - 1) throw error
        await sleep(Math.pow(2, i) * 1000)
      }
    }
  }
}
\`\`\`

## Data Architecture

\`\`\`yaml
data_layers:
  cache:
    provider: redis
    cluster: true
    ttl: 3600
    read_replicas: 3

  relational:
    provider: postgresql
    ha: true
    multi_az: true
    read_replicas:
      - region: us-east-1
      - region: eu-west-1

  warehouse:
    provider: snowflake
    retention: 365d

  documents:
    provider: dynamodb
    mode: on-demand
    ttl: 90d
\`\`\`

## Security Architecture

\`\`\`typescript
class SecurityContext {
  constructor(
    private identityProvider: IdentityProvider,
    private policyEngine: PolicyEngine
  ) {}

  async authorize(
    principal: Principal,
    resource: string,
    action: string
  ): Promise<boolean> {
    const identity = await this.identityProvider.verify(principal.token)
    if (!identity) return false

    const policy = await this.policyEngine.getPolicy(resource)
    return policy.allows(identity, action)
  }
}

const iamPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: ['s3:GetObject'],
      Resource: 'arn:aws:s3:::my-bucket/\${aws:userid}/*',
      Condition: {
        IpAddress: { 'aws:SourceIp': '10.0.0.0/8' }
      }
    }
  ]
}
\`\`\`

## Cost Optimization

\`\`\`yaml
optimization:
  compute:
    strategy: spot + on-demand
    spot_percentage: 70
    min_size: 2
    max_size: 100

  database:
    strategy: serverless
    auto_pause: true
    retention: 7d

  storage:
    tiering: true
    rules:
      - age: 90d
        tier: glacier
      - age: 365d
        tier: archive

  monitoring:
    cost_alerts:
      - threshold: 1000
        period: monthly
\`\`\`

## Best Practices

- Use managed services over self-managed
- Implement observability from day one
- Design for horizontal scaling
- Use infrastructure as code
- Automate everything (CI/CD)
- Implement proper secrets management
- Design for disaster recovery
- Regular security audits
- Cost monitoring and optimization
- Documentation as code
`
}
