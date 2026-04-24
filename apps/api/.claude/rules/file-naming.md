# File Naming Conventions — NestJS API

## Module Files

All files follow NestJS convention: `<name>.<type>.ts`

| Type | Suffix | Example |
|------|--------|---------|
| Module | `.module.ts` | `organizations.module.ts` |
| Controller | `.controller.ts` | `organizations.controller.ts` |
| Service | `.service.ts` | `organizations.service.ts` |
| Guard | `.guard.ts` | `auth.guard.ts` |
| Decorator | `.decorator.ts` | `current-user.decorator.ts` |
| DTO | `.dto.ts` | `create-org.dto.ts` |
| Filter | `.filter.ts` | `http-exception.filter.ts` |
| Interceptor | `.interceptor.ts` | `logging.interceptor.ts` |
| Pipe | `.pipe.ts` | `parse-org.pipe.ts` |
| Unit Test | `.spec.ts` | `organizations.service.spec.ts` |

## DTO Naming

- `create-<resource>.dto.ts` — POST body
- `update-<resource>.dto.ts` — PATCH body (extends Create with `@PartialType`)
- `<resource>.dto.ts` — Response DTO

```typescript
// update-resource.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}
```

## Directory Structure

New feature modules follow this structure:

```
src/<feature>/
├── dto/
│   ├── create-<feature>.dto.ts
│   ├── update-<feature>.dto.ts
│   └── <feature>.dto.ts
├── <feature>.controller.ts
├── <feature>.service.ts
└── <feature>.module.ts
```

## Barrel Exports

Avoid `index.ts` barrel files unless the feature is a library. Import directly from the source file.
