import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Todo } from '../../todos/entities/todo.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'Unique identifier for the user' })
  id: number;

  @Column({ unique: true })
  @Field(() => String, { description: 'Email address of the user' })
  email: string;

  @Column()
  @Field(() => String, { description: 'Name of the user' })
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  @Field(() => String, { description: 'When the user was created' })
  createdAt: string;

  @UpdateDateColumn()
  @Field(() => String, { description: 'When the user was last updated' })
  updatedAt: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  @Field(() => [Todo], { nullable: true })
  todos?: Todo[];
}
