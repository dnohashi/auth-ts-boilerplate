import { Field, InputType } from 'type-graphql';

@InputType()
export class TodoData {
  @Field(() => String)
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Date, { nullable: true })
  completedAt?: Date;
}
