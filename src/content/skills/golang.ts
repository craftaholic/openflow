import type { Skill } from '../../interfaces/skill'

export const golang: Skill = {
  name: "golang",
  description: "Go patterns for backend development",
  instruction: `# Go

## Error Handling

\`\`\`go
type AppError struct {
    Code    int
    Message string
    Cause   error
}

func (e *AppError) Error() string {
    if e.Cause != nil {
        return fmt.Sprintf("%s: %v", e.Message, e.Cause)
    }
    return e.Message
}

func (e *AppError) Unwrap() error {
    return e.Cause
}

func fetchUser(id string) (*User, error) {
    user, err := db.GetUser(id)
    if err != nil {
        return nil, &AppError{
            Code:    404,
            Message: "user not found",
            Cause:   err,
        }
    }
    return user, nil
}
\`\`\`

## Context Pattern

\`\`\`go
func (s *Service) DoWork(ctx context.Context, req *Request) (*Response, error) {
    if err := ctx.Err(); err != nil {
        return nil, err
    }

    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    return s.repo.Save(ctx, req)
}
\`\`\`

## Interface Design

\`\`\`go
type Repository interface {
    Create(ctx context.Context, user *User) error
    GetByID(ctx context.Context, id string) (*User, error)
    Update(ctx context.Context, user *User) error
    Delete(ctx context.Context, id string) error
}

func NewUserService(repo Repository) *UserService {
    return &UserService{repo: repo}
}
\`\`\`

## Testing

\`\`\`go
func TestUserService_Create(t *testing.T) {
    tests := []struct {
        name    string
        input   User
        wantErr bool
    }{
        {
            name:    "valid user",
            input:   User{Name: "Test", Email: "test@example.com"},
            wantErr: false,
        },
        {
            name:    "missing email",
            input:   User{Name: "Test"},
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            repo := &MockRepository{}
            svc := NewUserService(repo)

            err := svc.Create(context.Background(), &tt.input)

            if (err != nil) != tt.wantErr {
                t.Errorf("Create() error = %v, wantErr %v", err, tt.wantErr)
            }
        })
    }
}
\`\`\`

## Concurrency

\`\`\`go
func WorkerPool(ctx context.Context, jobs <-chan Job, workers int) {
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                job.Process(ctx)
            }
        }()
    }
    wg.Wait()
}

func ProcessAll(ctx context.Context, items []Item) []Result {
    results := make(chan Result, len(items))
    for _, item := range items {
        go func(it Item) {
            results <- processItem(ctx, it)
        }(item)
    }

    out := make([]Result, 0, len(items))
    for i := 0; i < len(items); i++ {
        select {
        case r := <-results:
            out = append(out, r)
        case <-ctx.Done():
            return out
        }
    }
    return out
}
\`\`\`

## Best Practices

- Return errors, not exceptions
- Defer cleanup (close files, connections)
- Use context for cancellation and timeouts
- Keep interfaces small and focused
- Write table-driven tests
- Avoid mutexes when channels suffice
- Use init() sparingly
- Handle errors at the appropriate level
`
}
