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
import { ForbiddenError, UserInputError } from 'apollo-server';
import { Todo } from '../entity/Todo';
import { UserType } from '../entity/User';
import { ContextType } from '../types';
import { TodoProps } from '../inputs/TodoInput';
import { FormError } from '../types/FormError';

@ObjectType()
export class TodoResponse {
  @Field(() => [FormError], { nullable: true })
  errors?: FormError[];

  @Field(() => [Todo], { nullable: true })
  todos?: Todo[];

  @Field(() => Todo, { nullable: true })
  todo?: Todo;

  @Field(() => String, { nullable: true })
  message?: string;
}

@Resolver(Todo)
export class TodoResolver {
  @Query(() => TodoResponse)
  @Authorized([UserType.ADMIN_USER, UserType.BETA_USER, UserType.NORMAL_USER])
  async todos(@Ctx() { req }: ContextType): Promise<TodoResponse> {
    try {
      const todos: Todo[] = await Todo.find({
        where: {
          userId: req.session.userId,
          deletedAt: null,
        },
      });

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

  @Mutation(() => TodoResponse)
  @Authorized([UserType.ADMIN_USER, UserType.BETA_USER, UserType.NORMAL_USER])
  async createTodo(
    @Arg('data') data: TodoProps,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo: Todo = await Todo.create({
        ...data,
        userId: req.session.userId,
      });

      await todo.save();

      return {
        todo,
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

  @Mutation(() => TodoResponse)
  @Authorized([UserType.ADMIN_USER, UserType.BETA_USER, UserType.NORMAL_USER])
  async deleteTodo(
    @Arg('id') id: string,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo: Todo | undefined = await Todo.findOne({
        where: { id: req.session.userId },
      });

      if (!todo) {
        throw new UserInputError('Todo could not be found', {
          field: 'todo',
        });
      }

      if (todo.userId !== req.session.userId) {
        throw new ForbiddenError('Forbidden');
      }

      Object.assign(todo, { deletedAt: new Date() });

      await todo.save();

      return {
        todo,
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

  @Mutation(() => TodoResponse)
  @Authorized([UserType.ADMIN_USER, UserType.BETA_USER, UserType.NORMAL_USER])
  async updateTodo(
    @Arg('id') id: string,
    @Arg('data') data: TodoProps,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo: Todo | undefined = await Todo.findOne({ where: { id } });

      if (!todo) {
        throw new UserInputError('Todo could not be found', {
          field: 'todo',
        });
      }

      if (todo.userId !== req.session.userId) {
        throw new ForbiddenError('Forbidden');
      }

      Object.assign(todo, data);

      await todo.save();

      return {
        todo,
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
