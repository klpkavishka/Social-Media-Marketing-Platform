# Contributing to UniSocial

Thank you for your interest in contributing to UniSocial! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect everyone to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards others

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 20+ installed
- Python 3.11+ installed
- Docker and Docker Compose
- Git configured
- Code editor (VS Code recommended)

### Setup Development Environment

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/unisocial.git
cd unisocial

# 3. Add upstream remote
git remote add upstream https://github.com/original/unisocial.git

# 4. Install dependencies
npm install

# 5. Copy environment variables
cp .env.example .env
# Edit .env with your values

# 6. Start development environment
docker-compose up -d

# 7. Run database migrations
cd backend && npm run migration:run
cd .. && cd frontend && npm install
```

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes
- `docs/*` - Documentation updates

---

## Development Process

### 1. Find or Create an Issue

Before starting work:

1. Check existing issues for similar work
2. If none exists, create a new issue
3. Discuss approach in the issue
4. Get approval from maintainers

### 2. Create a Branch

```bash
# Update your local develop branch
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b bugfix/issue-number-description
```

### 3. Make Changes

- Write clean, maintainable code
- Follow coding standards
- Add tests for new functionality
- Update documentation
- Keep commits atomic and focused

### 4. Test Your Changes

```bash
# Backend
cd backend
npm run test
npm run test:e2e
npm run lint

# Frontend
cd frontend
npm run test
npm run lint

# AI Service
cd ai-service
pytest
```

### 5. Commit Changes

Follow commit message conventions (see below)

```bash
git add .
git commit -m "feat(content): add AI caption generation"
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### TypeScript/JavaScript (Backend & Frontend)

#### Style Guide

- Use TypeScript strict mode
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Max line length: 100 characters

#### Naming Conventions

```typescript
// Classes: PascalCase
class UserService {}

// Interfaces: PascalCase with 'I' prefix (optional)
interface IUser {}

// Types: PascalCase
type UserRole = "admin" | "user";

// Functions/Methods: camelCase
function getUserById() {}

// Variables: camelCase
const userId = "123";

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;

// Files: kebab-case
user - service.ts;
content - controller.ts;
```

#### Code Organization

```typescript
// 1. Imports
import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";

// 2. Decorators
@Injectable()
export class UserService {
  // 3. Properties
  private readonly logger = new Logger(UserService.name);

  // 4. Constructor
  constructor(private readonly userRepository: UserRepository) {}

  // 5. Public methods
  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  // 6. Private methods
  private validateUser(user: User): boolean {
    return user.email && user.password;
  }
}
```

#### Best Practices

- Use async/await instead of promises
- Handle errors properly
- Use descriptive variable names
- Avoid nested callbacks
- Keep functions small and focused
- Use dependency injection
- Write self-documenting code

### Python (AI Service)

#### Style Guide

- Follow PEP 8
- 4 spaces for indentation
- Max line length: 88 (Black formatter)
- Type hints required

#### Naming Conventions

```python
# Classes: PascalCase
class ContentGenerator:
    pass

# Functions: snake_case
def generate_caption():
    pass

# Variables: snake_case
user_id = "123"

# Constants: UPPER_SNAKE_CASE
MAX_TOKENS = 1000

# Files: snake_case
content_generator.py
```

#### Code Organization

```python
# 1. Imports
from typing import List, Optional
from fastapi import APIRouter

# 2. Constants
MAX_RETRY_ATTEMPTS = 3

# 3. Class definition
class ContentGenerator:
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def generate(self, prompt: str) -> str:
        """Generate content based on prompt."""
        pass
```

---

## Testing Guidelines

### Backend Testing (NestJS)

#### Unit Tests

```typescript
describe("UserService", () => {
  let service: UserService;
  let repository: MockType<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should find user by id", async () => {
    const user = { id: "1", email: "test@example.com" };
    repository.findOne.mockReturnValue(user);

    expect(await service.findById("1")).toEqual(user);
    expect(repository.findOne).toHaveBeenCalledWith({ id: "1" });
  });
});
```

#### E2E Tests

```typescript
describe("UserController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/users (GET)", () => {
    return request(app.getHttpServer())
      .get("/users")
      .expect(200)
      .expect("Content-Type", /json/);
  });
});
```

### Frontend Testing (React)

#### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Python Testing

```python
import pytest
from app.services.content_generator import ContentGenerator

def test_content_generator_initialization():
    generator = ContentGenerator(api_key="test_key")
    assert generator.api_key == "test_key"

@pytest.mark.asyncio
async def test_generate_caption():
    generator = ContentGenerator(api_key="test_key")
    caption = await generator.generate("Test prompt")
    assert isinstance(caption, str)
    assert len(caption) > 0
```

### Test Coverage

- Aim for 80%+ code coverage
- Test happy paths and error cases
- Mock external dependencies
- Test edge cases
- Use meaningful test names

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Scopes

- `auth`: Authentication
- `content`: Content management
- `social`: Social media integration
- `analytics`: Analytics features
- `workflow`: Workflow engine
- `ui`: UI components
- `api`: API changes
- `db`: Database changes

### Examples

```bash
# Good commits
feat(content): add AI caption generation
fix(auth): resolve JWT token expiration issue
docs(api): update API documentation for new endpoints
refactor(social): simplify Instagram API integration
test(content): add unit tests for content service

# Bad commits
update stuff
fix bug
changes
wip
```

### Commit Best Practices

- One commit per logical change
- Write clear, descriptive messages
- Reference issue numbers when applicable
- Keep commits focused and atomic
- Don't commit commented code
- Don't commit console.log statements

---

## Pull Request Process

### Before Creating PR

1. ✅ All tests pass
2. ✅ Code is linted and formatted
3. ✅ Documentation updated
4. ✅ Commits are clean and meaningful
5. ✅ Branch is up to date with develop

### PR Title Format

Follow commit message format:

```
feat(content): Add AI caption generation feature
```

### PR Description Template

```markdown
## Description

Brief description of changes

## Related Issue

Closes #123

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review performed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

### Review Process

1. Create PR and request reviewers
2. Address review comments
3. Make requested changes
4. Request re-review if needed
5. Wait for approval
6. Squash and merge

### Approval Requirements

- At least 1 approval from maintainers
- All CI checks passing
- No merge conflicts
- Up-to-date with base branch

---

## Documentation

### Code Documentation

#### TypeScript/JavaScript

````typescript
/**
 * Retrieves a user by their unique identifier
 *
 * @param id - The unique user identifier
 * @returns Promise resolving to User object
 * @throws NotFoundException if user not found
 *
 * @example
 * ```typescript
 * const user = await userService.findById('123');
 * ```
 */
async findById(id: string): Promise<User> {
  const user = await this.userRepository.findOne({ id });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}
````

#### Python

```python
def generate_caption(
    prompt: str,
    max_tokens: int = 100,
    temperature: float = 0.7
) -> str:
    """
    Generate a social media caption using AI.

    Args:
        prompt: The input prompt for generation
        max_tokens: Maximum tokens in response (default: 100)
        temperature: Creativity level 0-1 (default: 0.7)

    Returns:
        Generated caption string

    Raises:
        ValueError: If prompt is empty
        APIError: If AI service fails

    Example:
        >>> caption = generate_caption("University event photo")
        >>> print(caption)
        "Amazing campus event! 🎓"
    """
    pass
```

### README Updates

When adding features, update relevant README sections:

- Installation instructions
- Configuration options
- Usage examples
- API documentation
- Troubleshooting

### Documentation Files

Update appropriate documentation:

- `docs/architecture/` - Architecture changes
- `docs/requirements/` - New requirements
- `docs/api/` - API changes
- `docs/database/` - Schema changes

---

## Questions?

If you have questions:

1. Check existing documentation
2. Search GitHub issues
3. Ask in GitHub Discussions
4. Contact maintainers

---

## Thank You!

Your contributions make UniSocial better for everyone. Thank you for being part of our community! 🎉

---

**Maintainers**: [List of maintainers]
**Last Updated**: January 21, 2026
