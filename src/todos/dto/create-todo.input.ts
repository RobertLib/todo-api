import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTodoInput {
  @Field(() => String, { description: 'The title of the todo item' })
  title: string;

  @Field(() => String, { description: 'The description of the todo item' })
  description: string;

  @Field(() => Boolean, { description: 'The status of the todo item' })
  completed: boolean;
}
