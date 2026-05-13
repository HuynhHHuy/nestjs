import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';

@Controller('todos')
export class TodosController {
    @Get()
    findAll(): string {
        return 'This action returns all todos';
    }

    @Get(':id')
    getById(@Param() params: { id: string }): string {
        return `This action returns the todo with ID: ${params.id}`;
    }

    @Post()
    create(@Body() body: any, @Headers('authorization') auth: string) {
        if (auth) {
            return `This action creates a new todo with the following data: ${JSON.stringify(body)} and authorization header: ${auth}`;
        }
        return "Vui long cung cap header authorization";
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return `This action updates the todo with ID: ${id} with the following data: ${JSON.stringify(body)}`;
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return `This action deletes the todo with ID: ${id}`;
    }
}
