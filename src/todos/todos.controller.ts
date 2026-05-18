import { Body, Controller, Delete, Get, Headers, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@Controller('todos')
export class TodosController {
    @Get()
    findAll(
        @Query() queryParamsDto: QueryParamsDto
    ) {
        return `Lay todos voi quality: ${queryParamsDto.priority}, limit: ${queryParamsDto.limit}, page: ${queryParamsDto.page}`;
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number): string {
        return `This action returns the todo with ID: ${id}`;
    }

    @Post()
    create(@Body() CreateTodoDto: CreateTodoDto, @Headers('authorization') auth: string) {
        if (auth) {
            return `This action creates a new todo with the following data: ${JSON.stringify(CreateTodoDto)} and authorization header: ${auth}`;
        }
        return "Vui long cung cap header authorization";
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() UpdateTodoDto: UpdateTodoDto) {
        return `This action updates the todo with ID: ${id} with the following data: ${JSON.stringify(UpdateTodoDto)}`;
    }

    @HttpCode(204)
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return `This action deletes the todo with ID: ${id}`;
    }
}
