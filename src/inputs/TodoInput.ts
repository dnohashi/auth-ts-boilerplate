import { Field, ID, InputType } from 'type-graphql';
import { Todo } from '../entity/Todo';

@InputType()
export class CreateTodoInput {
  @Field(() => [Todo])
  todos!: Todo[];
}

@InputType()
class UpdateData {
  @Field(() => String)
  title?: string;
  description?: string;
  completedAt?: Date;
}

@InputType()
export class UpdateTodoInput {
  @Field(() => ID)
  id!: string;

  @Field(() => Todo)
  data!: UpdateData;
}
