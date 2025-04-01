import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

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

  @ManyToOne(() => User, (user) => user.todos)
  @Field(() => User, { nullable: true })
  user?: User;

  @Column({ nullable: true })
  userId: number;

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
