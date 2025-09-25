# Contributing to Plants

Thank you for your interest in contributing to the Plants project! This guide will help you get started, set up your development environment, and understand our contribution workflow.

## Introduction

This project is a Next.js application for managing plant inventory with QR code generation, MongoDB integration, and Square payment processing. We welcome contributions from developers of all skill levels.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher (recommended: latest LTS)
- **npm**: Comes with Node.js (we use npm as our package manager)
- **Git**: For version control
- **MongoDB**: For local development (or MongoDB Atlas connection)

Check your versions:
```bash
node --version
npm --version
git --version
```

## Cloning the Repository

### HTTPS (Quick start)
```bash
git clone https://github.com/guacamolie/plants.git
cd plants
```

### SSH (Recommended after key setup)
```bash
git clone git@github.com:guacamolie/plants.git
cd plants
```

**Note**: SSH is recommended once you have configured your SSH key (see next section) as it's more secure and convenient for regular contributions.

## SSH Key Setup

Setting up SSH keys prevents "Permission denied (publickey)" errors and provides secure, password-free authentication.

### Generate SSH Key

#### macOS/Linux
```bash
# Generate a new ed25519 SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start ssh-agent and add your key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

#### Windows
```bash
# In PowerShell or Git Bash
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start ssh-agent (PowerShell as Administrator)
Get-Service -Name ssh-agent | Set-Service -StartupType Manual
Start-Service ssh-agent

# Add your key
ssh-add ~/.ssh/id_ed25519
```

### Add SSH Key to GitHub

1. Copy your public key:
   ```bash
   # macOS
   pbcopy < ~/.ssh/id_ed25519.pub
   
   # Linux
   cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard
   
   # Windows
   cat ~/.ssh/id_ed25519.pub | clip
   ```

2. Go to GitHub → Settings → SSH and GPG keys → New SSH key
3. Paste your key and give it a descriptive title
4. Click "Add SSH key"

### Test SSH Connection
```bash
ssh -T git@github.com
```

You should see: `Hi username! You've successfully authenticated, but GitHub does not provide shell access.`

## Troubleshooting Permission denied (publickey)

| Issue | Cause | Solution |
|-------|-------|----------|
| No SSH key | Key not generated | Follow SSH key setup above |
| Wrong account | Using wrong GitHub account | Check `ssh -T git@github.com` output |
| Key not loaded | ssh-agent not running or key not added | Run `ssh-add ~/.ssh/id_ed25519` |
| Deploy key conflicts | Repository has deploy key with same key | Use different SSH key or remove deploy key |
| Git for Windows + OpenSSH mix | Conflicting SSH clients on Windows | Use Git Bash or configure Git to use OpenSSH |
| SSO authorization | Organization requires SSO | Authorize SSH key for SSO in GitHub settings |

## Installing Dependencies & Running the Project

### Install Dependencies
```bash
npm install
```

### Available Scripts
```bash
# Development server with Turbopack (fast refresh)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Setup
Create a `.env.local` file in the root directory:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Branching & Pull Request Workflow

### Branch Naming Convention
Use the format: `type/short-description`

Examples:
- `feat/add-plant-search`
- `fix/qr-code-generation`
- `docs/update-readme`
- `refactor/database-connection`

### Workflow Steps

1. **Sync with main branch**:
   ```bash
   git checkout master
   git pull origin master
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes and commit**:
   ```bash
   git add .
   git commit -m "feat: add plant search functionality"
   ```

4. **Push your branch**:
   ```bash
   git push origin feat/your-feature-name
   ```

5. **Open Pull Request** on GitHub with:
   - Clear title describing the change
   - Description explaining what and why
   - Link to any related issues

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>: <description>

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi colons, etc)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes
- **perf**: Performance improvements

### Examples
```bash
feat: add QR code generation for plants
fix: resolve MongoDB connection timeout
docs: update API documentation
refactor: extract plant validation logic
test: add unit tests for plant model
```

## Code Style & Linting

### Running the Linter
```bash
npm run lint
```

### ESLint Configuration
The project uses ESLint with Next.js and TypeScript configurations. Key rules:
- No unused variables
- Prefer const over let
- No explicit any types
- React hooks rules
- Next.js specific rules

**Note**: Please ensure your code passes linting before submitting a PR. Fix any linting errors that are related to your changes.

## Testing

**Current Status**: The project doesn't have a comprehensive test suite yet.

### Future Testing Guidelines
- Write unit tests for new utility functions
- Add integration tests for API routes
- Consider E2E tests for critical user flows
- Use Jest and React Testing Library when tests are added

**Contribution Opportunity**: Adding test infrastructure would be a valuable contribution!

## Review Checklist

Before submitting your PR, ensure:

- [ ] Code passes linting (`npm run lint`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Manual testing completed for your changes
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventional format
- [ ] Changes are focused and minimal
- [ ] No unrelated changes included
- [ ] Branch is up to date with master

## Large Features

For significant new features or architectural changes:
1. Open an issue first to discuss the approach
2. Get feedback from maintainers before starting work
3. Consider breaking large changes into smaller PRs
4. Update documentation and add tests

## License

**Note**: This project currently doesn't have a LICENSE file. Contributors should be aware that without a license, all rights are reserved by default. Consider adding an appropriate open source license (e.g., MIT, Apache 2.0) to clarify usage and contribution terms.

## Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Be patient and respectful in all interactions
- Provide clear reproduction steps for bugs

## Code of Conduct

Please be respectful and inclusive in all interactions. We're here to build great software together!

---

Thank you for contributing to Plants! 🌱