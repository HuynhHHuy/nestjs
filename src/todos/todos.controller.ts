import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';

@Controller('todos')
export class TodosController {
    @Get()
    findAll(
        @Query('priority') priority?: 'HIGH' | 'MEDIUM' | 'LOW',
        @Query('limit') limit?: string,
        @Query('page') page?: string,
    ): string {
        return `Lay todos voi quality: ${priority}, limit: ${limit}, page: ${page}`;
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

    @HttpCode(204)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return `This action deletes the todo with ID: ${id}`;
    }
}
