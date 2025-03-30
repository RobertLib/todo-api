import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Todo {
  @PrimaryGeneratedColumn()
  @Field(() => Int, {
    description: 'The unique identifier of the todo item',
  })
  id: number;

  @Column()
  @Field(() => String, {
    description: 'The title of the todo item',
  })
  title: string;

  @Column()
  @Field(() => String, {
    description: 'The description of the todo item',
  })
  description: string;

  @Column()
  @Field(() => Boolean, {
    description: 'The status of the todo item',
  })
  completed: boolean;

  @CreateDateColumn()
  @Field(() => String, {
    description: 'The date when the todo item was created',
  })
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String, {
    description: 'The date when the todo item was last updated',
  })
  updatedAt: string;
}
