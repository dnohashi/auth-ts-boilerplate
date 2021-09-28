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
import { Todo } from '../entity/Todo';
import { UserType } from '../entity/User';
import { ContextType } from '../types';
import { TodoProps } from '../inputs/TodoInput';
import { FormError } from '../types/FormError';
import { findTodoByIdForUserSession } from './utils/findTodoByIdForUserSession';

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
  // Fetches todos for user
  @Query(() => TodoResponse)
  @Authorized([UserType.ADMIN_USER, UserType.BETA_USER, UserType.NORMAL_USER])
  async todos(@Ctx() { req }: ContextType): Promise<TodoResponse> {
    try {
      const todos: Todo[] = await Todo.find({
        where: {
          userId: req.session.userId,
          deletedAt: null,
        },
        order: {
          createdAt: 'DESC',
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

  // Creates new record based on request data
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

  // Sets deletedAt
  @Mutation(() => TodoResponse)
  @Authorized([UserType.ADMIN_USER, UserType.BETA_USER, UserType.NORMAL_USER])
  async deleteTodo(
    @Arg('id') id: string,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo: Todo = await findTodoByIdForUserSession({
        id,
        userId: req.session.userId,
      });

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

  // Sets completedAt
  @Mutation(() => TodoResponse)
  @Authorized([UserType.ADMIN_USER, UserType.BETA_USER, UserType.NORMAL_USER])
  async completeTodo(
    @Arg('id') id: string,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo: Todo = await findTodoByIdForUserSession({
        id,
        userId: req.session.userId,
      });

      Object.assign(todo, { completedAt: new Date() });

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

  // Nullifies completedAt
  @Mutation(() => TodoResponse)
  @Authorized([UserType.ADMIN_USER, UserType.BETA_USER, UserType.NORMAL_USER])
  async resetTodo(
    @Arg('id') id: string,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo: Todo = await findTodoByIdForUserSession({
        id,
        userId: req.session.userId,
      });

      Object.assign(todo, { completedAt: null });

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

  // Updates Todo by id and request data
  @Mutation(() => TodoResponse)
  @Authorized([UserType.ADMIN_USER, UserType.BETA_USER, UserType.NORMAL_USER])
  async updateTodo(
    @Arg('id') id: string,
    @Arg('data') data: TodoProps,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo: Todo = await findTodoByIdForUserSession({
        id,
        userId: req.session.userId,
      });

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
