import { Module } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { TodosResolver } from './todos.resolver';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodosResolver, TodosService],
})
export class TodosModule {}
