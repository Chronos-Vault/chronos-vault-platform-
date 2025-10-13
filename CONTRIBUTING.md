# Contributing to Chronos Vault

Thank you for your interest in contributing to Chronos Vault! We're building the world's first **mathematically provable** blockchain security platform, and we welcome contributions from developers, security researchers, and blockchain enthusiasts.

---

## 🎯 Our Philosophy

**"Trust Math, Not Humans"**

Every feature we build must be:
- **Mathematically provable** (formal verification preferred)
- **Cryptographically secure** (no trust assumptions)
- **Well-documented** (for transparency)
- **Thoroughly tested** (automated + manual)

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 18+** and npm
- **PostgreSQL** database
- **Git** for version control
- **TypeScript** knowledge
- **Basic blockchain** understanding

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/chronos-vault-platform-.git
   cd chronos-vault-platform-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 🏗️ Project Structure

```
chronos-vault-platform/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable UI components
│   │   └── lib/        # Utilities and helpers
├── server/              # Express backend
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Database interface
│   └── index.ts        # Server entry point
├── shared/              # Shared types
│   └── schema.ts       # Database schema + Zod validation
├── contracts/           # Smart contracts
│   ├── ethereum/       # Solidity contracts
│   ├── solana/         # Rust programs
│   └── ton/            # FunC contracts
├── trinity-protocol/    # Cross-chain consensus
└── docs/               # Documentation
```

---

## 🔧 Development Guidelines

### Code Standards

#### TypeScript
- Use **strict TypeScript** - no `any` types
- Define types in `shared/schema.ts` for consistency
- Use Zod schemas for validation
- Follow existing code patterns

#### React/Frontend
- Use **functional components** with hooks
- Prefer **shadcn/ui** components over custom ones
- Use **TanStack Query** for data fetching
- Add `data-testid` attributes for testing
- Keep components focused and reusable

#### Backend/API
- Keep routes **thin** - business logic in storage layer
- Validate requests with **Zod schemas**
- Use **IStorage** interface for database operations
- Return consistent error responses

#### Smart Contracts
- Follow **security best practices**
- Add **comprehensive tests**
- Document all public functions
- Use OpenZeppelin libraries when possible

### Database Changes

**Important**: Never manually write SQL migrations!

1. Update schema in `shared/schema.ts`
2. Update storage interface in `server/storage.ts`
3. Run: `npm run db:push` (or `npm run db:push --force` if needed)

**Never change ID types** - This breaks existing data!

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style (formatting, semicolons)
refactor: Code refactoring
test:     Adding tests
chore:    Maintenance tasks

# Examples
feat(vault): Add quantum-resistant encryption layer
fix(bridge): Resolve cross-chain sync issue
docs(readme): Update installation instructions
test(trinity): Add consensus validation tests
```

---

## 🧪 Testing

### Run Tests

```bash
# All tests
npm test

# Smart contract tests
npx hardhat test

# Type checking
npm run check
```

### Writing Tests

- Write tests for **all new features**
- Test **edge cases** and error handling
- Mock external dependencies
- Aim for **>80% coverage**

---

## 🔐 Security Contributions

### Reporting Vulnerabilities

**CRITICAL**: Never publicly disclose security issues!

1. **Email**: security@chronosvault.org
2. **Include**: Detailed reproduction steps
3. **Wait**: 48 hours for response
4. **Disclosure**: Coordinate with team (90-day window)

See our [Security Policy](https://github.com/Chronos-Vault/chronos-vault-security/blob/main/SECURITY.md) for details.

### Bug Bounty Program

- **$500 - $50,000** rewards
- See [Bug Bounty Program](https://github.com/Chronos-Vault/chronos-vault-security/blob/main/BUG_BOUNTY.md)

---

## 📝 Documentation

### Required Documentation

When contributing, update:

1. **Code Comments**: Document complex logic
2. **README.md**: Update if adding features
3. **API Docs**: Document new endpoints
4. **Type Definitions**: Keep types up to date

### Documentation Standards

- Use **clear, concise** language
- Include **code examples**
- Explain **why**, not just what
- Keep docs **in sync** with code

---

## 🔄 Pull Request Process

### Before Submitting

1. **Run tests**: Ensure all tests pass
2. **Type check**: `npm run check` passes
3. **Update docs**: README, comments, etc.
4. **Commit messages**: Follow conventions
5. **Rebase**: Keep history clean

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this?

## Checklist
- [ ] Tests pass
- [ ] Types are correct
- [ ] Documentation updated
- [ ] Follows code style
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Submit PR** - Include detailed description
2. **Automated checks** - CI/CD runs tests
3. **Code review** - Maintainers review code
4. **Address feedback** - Make requested changes
5. **Approval** - PR approved by 2+ maintainers
6. **Merge** - Squash and merge to main

---

## 🌟 Contribution Areas

### Frontend Development
- UI/UX improvements
- New vault type interfaces
- Performance optimizations
- Accessibility enhancements

### Backend Development
- API endpoints
- Database optimizations
- Authentication improvements
- WebSocket features

### Smart Contracts
- New vault types
- Cross-chain features
- Gas optimizations
- Security enhancements

### Documentation
- Tutorials and guides
- API documentation
- Code examples
- Video tutorials

### Security
- Vulnerability research
- Formal verification
- Cryptographic review
- Penetration testing

### Testing
- Unit tests
- Integration tests
- E2E tests
- Performance tests

---

## 🏆 Recognition

### Hall of Fame

Top contributors are recognized in:
- **GitHub README** - Listed as contributors
- **Release notes** - Credited for features
- **Blog posts** - Featured articles
- **Conference talks** - Speaking opportunities

### Rewards

- **CVT Tokens**: Bonus rewards for significant contributions
- **NFT Badges**: Milestone achievements
- **Swag**: Chronos Vault merchandise
- **Access**: Early feature access

---

## 📚 Resources

### Learning Resources

- **[Whitepaper](./CHRONOS_VAULT_WHITEPAPER_v1.0.md)** - Technical architecture
- **[Documentation](https://github.com/Chronos-Vault/chronos-vault-docs)** - Complete guides
- **[Smart Contracts](https://github.com/Chronos-Vault/chronos-vault-contracts)** - Contract code
- **[SDK](https://github.com/Chronos-Vault/chronos-vault-sdk)** - Developer SDK

### Getting Help

- **Discord**: [https://discord.gg/WHuexYSV](https://discord.gg/WHuexYSV)
- **GitHub Issues**: For bugs and features
- **Email**: chronosvault@chronosvault.org

---

## 🤝 Code of Conduct

### Our Standards

- **Be respectful** - Treat everyone with kindness
- **Be collaborative** - Work together constructively
- **Be inclusive** - Welcome diverse perspectives
- **Be professional** - Maintain high standards

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing private information
- Unethical security research

### Enforcement

Violations may result in:
- Warning
- Temporary ban
- Permanent ban
- Legal action (if applicable)

Report violations to: chronosvault@chronosvault.org

---

## 📞 Contact

### Development Team
- **Email**: chronosvault@chronosvault.org
- **Discord**: [Community Server](https://discord.gg/WHuexYSV)
- **Twitter/X**: [@chronosvaultx](https://x.com/chronosvaultx)

### Security Team
- **Email**: security@chronosvault.org
- **PGP Key**: Available on keyserver

---

## 🎓 First-Time Contributors

New to open source? We're here to help!

### Good First Issues

Look for issues labeled:
- `good first issue` - Perfect for beginners
- `help wanted` - Need community help
- `documentation` - Docs improvements

### Mentorship

- Ask questions in Discord
- Tag maintainers in PRs
- Request code reviews
- Join community calls

---

## 📋 Checklist for Contributors

Before submitting your contribution:

- [ ] Code follows project style
- [ ] Tests are added and passing
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] PR description is clear
- [ ] No breaking changes (or documented)
- [ ] All CI checks pass
- [ ] Security implications considered

---

## 🔄 Release Cycle

- **Main branch**: Production-ready code
- **Develop branch**: Integration branch
- **Feature branches**: Individual features
- **Releases**: Tagged versions (semantic versioning)

### Version Scheme

```
MAJOR.MINOR.PATCH
1.0.0 → 1.0.1 (patch - bug fixes)
1.0.1 → 1.1.0 (minor - new features)
1.1.0 → 2.0.0 (major - breaking changes)
```

---

## 🌍 Community

Join the Chronos Vault community:

- **Discord**: Developer discussions and support
- **Twitter/X**: Latest updates and announcements
- **Medium**: Technical articles and tutorials
- **GitHub**: Code and documentation

---

## 📜 License

By contributing to Chronos Vault, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

**Thank you for contributing to Chronos Vault!** 🚀

Together, we're building the future of mathematically provable blockchain security.

*"Trust Math, Not Humans"*
