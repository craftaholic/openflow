import type { Skill } from '../../interfaces/skill'

export const cleanarchitecture: Skill = {
  name: "clean-architecture",
  description: "Clean Architecture principles and patterns",
  instruction: `# Clean Architecture

## Core Principles

Layers:
- Entities (Business rules)
- Use Cases (Application rules)
- Interface Adapters (Controllers, Gateways)
- Frameworks & Drivers (Web, DB, UI)

Dependency Rule: Dependencies point inward.

## Layer Structure

\`\`\`typescript
src/
├── application/        # Use cases, services
│   ├── use-cases/
│   │   ├── create-user.ts
│   │   └── update-user.ts
│   └── services/
│       └── user-service.ts
├── domain/             # Business entities
│   ├── entities/
│   │   └── user.ts
│   └── rules/
│       └── user-validation.ts
├── interfaces/         # Controllers, gateways
│   ├── controllers/
│   │   └── user-controller.ts
│   ├── gateways/
│   │   └── user-repository.ts
│   └── dto/
│       └── user-dto.ts
├── infrastructure/     # External concerns
│   ├── database/
│   │   └── prisma-user-repository.ts
│   └── http/
│       └── express-adapter.ts
└── main.ts             # Composition root
\`\`\`

## Entity Pattern

\`\`\`typescript
export class User {
  constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _name: string,
    private readonly _createdAt: Date
  ) {}

  get id() { return this._id }
  get email() { return this._email }
  get name() { return this._name }
  get createdAt() { return this._createdAt }

  rename(newName: string): User {
    if (newName.length < 2) {
      throw new Error('Name must be at least 2 characters')
    }
    return new User(this._id, this._email, newName, this._createdAt)
  }
}
\`\`\`

## Repository Pattern

\`\`\`typescript
export interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<void>
  delete(id: string): Promise<void>
}

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    return user ? User.fromPrisma(user) : null
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: user.toPrisma(),
      create: user.toPrisma()
    })
  }
}
\`\`\`

## Use Case Pattern

\`\`\`typescript
export interface InputBoundary {
  execute(input: CreateUserInput): Promise<void>
}

export interface OutputBoundary {
  present(result: CreateUserResult): void
}

export class CreateUserUseCase implements InputBoundary {
  constructor(
    private userRepository: UserRepository,
    private outputPresenter: OutputBoundary
  ) {}

  async execute(input: CreateUserInput): Promise<void> {
    if (!isValidEmail(input.email)) {
      this.outputPresenter.present({
        success: false,
        error: 'Invalid email'
      })
      return
    }

    const existing = await this.userRepository.findByEmail(input.email)
    if (existing) {
      this.outputPresenter.present({
        success: false,
        error: 'Email already exists'
      })
      return
    }

    const user = User.create(input.email, input.name)
    await this.userRepository.save(user)

    this.outputPresenter.present({
      success: true,
      userId: user.id
    })
  }
}
\`\`\`

## Dependency Injection

\`\`\`typescript
function createUserController(): UserController {
  const prisma = new PrismaClient()
  const repository = new PrismaUserRepository(prisma)
  const useCase = new CreateUserUseCase(repository, new CreateUserPresenter())
  return new UserController(useCase)
}

class MockUserRepository implements UserRepository {
  private users: User[] = []
  async save(user: User) { this.users.push(user) }
  async findById(id: string) { return this.users.find(u => u.id === id) || null }
}

describe('CreateUserUseCase', () => {
  it('creates user successfully', async () => {
    const mockRepo = new MockUserRepository()
    const useCase = new CreateUserUseCase(mockRepo, new MockPresenter())
    await useCase.execute({ email: 'test@test.com', name: 'Test' })
    expect(mockRepo.users).toHaveLength(1)
  })
})
\`\`\`

## Best Practices

- Keep entities simple (data + business rules)
- Use use cases for each business action
- Depend on interfaces, not implementations
- Keep outer layers unaware of inner layers
- Test business rules without frameworks
- Use ports (interfaces) for external systems
- Single responsibility per module
- Avoid "scaffold" code
`
}
