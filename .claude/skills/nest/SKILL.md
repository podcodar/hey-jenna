---
name: nest
description: NestJS CLI generator and scaffolding assistant for modules, controllers, services, CRUD resources, DTOs, and Prisma entity integration in the Hey Jenna project.
---

# NestJS Generator & Scaffolding Skill

Use this skill whenever you need to create or scaffold new NestJS components, resources, modules, CRUD APIs, DTOs, or integrate new Prisma database models into the `hey-jenna/server` application.

## Capabilities & Usage

### 1. Generate Components via Nest CLI

Always execute CLI commands in the `server/` directory or use `node scripts/nest-generate.js`:

```bash
# Generate full CRUD resource (Module, Controller, Service, DTOs, Entities, Specs)
cd server && npx nest g resource <name> --no-spec

# Or generate individual building blocks:
cd server && npx nest g module <name>
cd server && npx nest g service <name>
cd server && npx nest g controller <name>
```

### 2. Standard Feature Module Layout

When scaffolding a feature (e.g. `videos`, `playlists`, `comments`):

```text
server/src/<feature>/
├── <feature>.module.ts       # Nest module definition
├── <feature>.controller.ts   # Route handlers with Swagger decorators & ValidationPipe
├── <feature>.service.ts      # Business logic injecting PrismaService
├── <feature>.dto.ts          # Request & Response DTOs with class-validator
├── <feature>.controller.spec.ts # Unit tests for controller
└── <feature>.service.spec.ts    # Unit tests for service
```

### 3. Implementing DTOs with Validation & Swagger

Ensure every created DTO includes `class-validator` and `@nestjs/swagger` decorators:

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ description: 'Title of the item', example: 'My Video' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Optional description' })
  @IsString()
  @IsOptional()
  description?: string;
}
```

### 4. Prisma Integration Workflow

When adding or updating a database entity:
1. Update `server/prisma/schema.prisma` with the model definition:
   ```prisma
   model Item {
     id          String   @id @default(uuid())
     title       String
     description String?
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```
2. Create migration and regenerate client:
   ```bash
   cd server && npx prisma migrate dev --name create_<name>_table
   cd server && npx prisma generate
   ```
3. Import the generated type in your service/controller:
   ```typescript
   import { Item } from 'generated/prisma';
   import { PrismaService } from '../prisma.service';
   ```

### 5. Controller Template

```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto } from './items.dto';
import { Item } from 'generated/prisma';

@ApiTags('items')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'The item has been successfully created.' })
  create(@Body() createDto: CreateItemDto): Promise<Item> {
    return this.itemsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all items' })
  findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  findOne(@Param('id') id: string): Promise<Item | null> {
    return this.itemsService.findOne(id);
  }
}
```

### 6. Verification Checklist
After scaffolding:
- [ ] Registered in `server/src/app.module.ts`
- [ ] `cd server && pnpm run lint` passes
- [ ] `cd server && pnpm run test` passes
- [ ] `cd server && pnpm run build` builds successfully
