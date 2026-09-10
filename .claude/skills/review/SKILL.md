---
name: review
description: Comprehensive code reviewer for the Hey Jenna repository. Analyzes git diffs, checks NestJS conventions, Prisma safety, DTO validation, security, error handling, and test coverage.
---

# Code Review Skill — Hey Jenna

Use this skill to perform a thorough, multi-dimensional code review on modified files, current git diffs, or open pull requests.

## Review Steps

1. **Inspect the Git Changes**:
   ```bash
   git diff main...HEAD
   # or
   git status && git diff
   ```

2. **Verify Architecture & NestJS Best Practices**:
   - Are modules, controllers, and services properly decoupled?
   - Is business logic placed in services, not controllers?
   - Are dependency injections using readonly private modifiers (`private readonly service: Service`)?
   - Is every module registered correctly in `app.module.ts`?

3. **Check DTOs & Validation**:
   - Are all incoming request payloads mapped to explicit DTO classes?
   - Does every property have appropriate `class-validator` decorators (e.g. `@IsString()`, `@IsUUID()`, `@IsNotEmpty()`, `@IsOptional()`)?
   - Are Swagger annotations (`@ApiProperty()`, `@ApiPropertyOptional()`, `@ApiTags()`) present for API documentation?
   - Is `@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))` applied or supported globally?

4. **Verify Database & Prisma Security**:
   - Are Prisma queries safe from SQL injection / improper raw queries?
   - Are unique constraints and indexes properly leveraged in `schema.prisma`?
   - Are relationships handled properly with cascade rules where applicable?
   - Did any schema change include a corresponding migration?

5. **Error Handling & Edge Cases**:
   - Are standard NestJS HTTP exceptions used (`NotFoundException`, `BadRequestException`, `ForbiddenException`, `InternalServerErrorException`)?
   - Are asynchronous promises handled with proper error boundaries?
   - Is sensitive data (passwords, tokens, internal stack traces) shielded from API responses?

6. **Automated Verification**:
   - Run linter and tests:
     ```bash
     bash scripts/validate.sh
     ```

## Output Review Report Format

Format your findings structured as follows:

```markdown
### 📋 Code Review Summary
- **Files Inspected**: `server/src/...`
- **Overall Verdict**: [Approved | Changes Requested | Needs Discussion]

#### 🔍 Strengths
- Highlights of good patterns, clean logic, or solid tests.

#### ⚠️ Issues & Improvements
1. **[Category: Validation / Security / Architecture / Performance]** `file.ts:L12-L15`
   - **Problem**: Description of the issue.
   - **Recommendation**: Concrete fix or diff suggestion.

#### 🧪 Test & Validation Status
- Unit tests status (`pnpm run test`): [Passed / Failed]
- Linter status (`pnpm run lint`): [Passed / Failed]
- Build status (`pnpm run build`): [Passed / Failed]
```
