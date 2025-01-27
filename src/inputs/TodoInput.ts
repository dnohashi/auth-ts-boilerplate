import { Field, InputType } from 'type-graphql';

@InputType()
export class TodoProps {
  @Field(() => String)
  title?: string;

  @Field(() => Date, { nullable: true })
  completedAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
