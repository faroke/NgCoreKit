---
description: Systematically add missing Swagger decorators to NestJS controllers for complete API documentation
allowed-tools: Read, Edit, Write, Glob, Grep
---

<objective>
Identify and add Swagger decorators (`@ApiOperation`, `@ApiResponse`, `@ApiTags`) to NestJS controller endpoints that are missing documentation.
</objective>

<process>
1. **Explore**: Find all `apps/api/src/**/*.controller.ts` files
2. **Analyze**: Identify endpoints without `@ApiOperation` or `@ApiResponse` decorators
3. **Enhance**: Add Swagger decorators following the templates below
4. **Verify**: Ensure all endpoints have at minimum `@ApiOperation` and one `@ApiResponse`
</process>

<templates>

## Controller class (add @ApiTags if missing)
```typescript
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resource-name')
@Controller('resource-name')
export class ResourceController { ... }
```

## GET list endpoint
```typescript
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Get()
@ApiOperation({ summary: 'List all resources' })
@ApiResponse({ status: 200, description: 'Resources retrieved successfully', type: [ResourceDto] })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async findAll(@CurrentUser() user: AuthenticatedUser): Promise<ResourceDto[]> { ... }
```

## GET one endpoint
```typescript
@Get(':id')
@ApiOperation({ summary: 'Get a resource by ID' })
@ApiResponse({ status: 200, description: 'Resource found', type: ResourceDto })
@ApiResponse({ status: 404, description: 'Resource not found' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async findOne(@Param('id') id: string): Promise<ResourceDto> { ... }
```

## POST endpoint
```typescript
@Post()
@ApiOperation({ summary: 'Create a new resource' })
@ApiResponse({ status: 201, description: 'Resource created successfully', type: ResourceDto })
@ApiResponse({ status: 400, description: 'Validation error' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async create(@Body() dto: CreateResourceDto): Promise<ResourceDto> { ... }
```

## PATCH endpoint
```typescript
@Patch(':id')
@ApiOperation({ summary: 'Update a resource' })
@ApiResponse({ status: 200, description: 'Resource updated successfully', type: ResourceDto })
@ApiResponse({ status: 400, description: 'Validation error' })
@ApiResponse({ status: 404, description: 'Resource not found' })
async update(@Param('id') id: string, @Body() dto: UpdateResourceDto): Promise<ResourceDto> { ... }
```

## DELETE endpoint
```typescript
@Delete(':id')
@ApiOperation({ summary: 'Delete a resource' })
@ApiResponse({ status: 200, description: 'Resource deleted successfully' })
@ApiResponse({ status: 404, description: 'Resource not found' })
async remove(@Param('id') id: string): Promise<void> { ... }
```

</templates>

<rules>
- ALWAYS read the controller file before adding decorators
- Use existing DTO types in `@ApiResponse({ type: XxxDto })`
- Add `@ApiTags` to the controller class if missing
- Keep summary short (max 50 chars) and descriptive
- Import all decorators from `@nestjs/swagger`
- For org-scoped endpoints, also add `@ApiHeader({ name: 'x-org-slug', description: 'Organization slug' })`
</rules>

<success_criteria>
- All controller endpoints have `@ApiOperation`
- All endpoints have at least success and 401 `@ApiResponse`
- Controller classes have `@ApiTags`
- Swagger UI shows complete documentation
</success_criteria>
