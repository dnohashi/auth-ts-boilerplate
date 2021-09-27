import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { getManager } from 'typeorm';
import { UserInputError } from 'apollo-server';
import { Todo } from '../entity/Todo';
import { User } from '../entity/User';
import { ContextType } from '../types';
// Define Todo Inputs (Interfaces)
import { FormError } from '../types/FormError';

@ObjectType()
export class TodoResponse {
  @Field(() => [FormError], { nullable: true })
  errors?: FormError[];

  @Field(() => [Todo], { nullable: true })
  todos?: Todo[];

  @Field(() => String, { nullable: true })
  message?: string;
}

@Resolver(Todo)
export class TodoResolver {
  @Query(() => TodoResponse, { nullable: true })
  async todos(@Ctx() { req }: ContextType): Promise<TodoResponse> {
    try {
      const userId = req.session.userId;

      if (!userId && !req.user) {
        return {
          errors: [
            {
              field: 'user',
              message: 'User already logged out.',
            },
          ],
        };
      }

      const todos = await Todo.find({ where: { userId } });

      return {
        todos,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: 'exception',
            message: error.message,
          },
        ],
      };
    }
  }
}
