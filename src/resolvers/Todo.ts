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
import { ContextType } from '../types';
import { TodoProps } from '../inputs/TodoInput';
import { FormError } from '../types/FormError';
import {
  findTodoByIdForUserSession,
  updateTodoWithProperties,
} from '../helpers/todos';
import { AUTHORIZED_USER_TYPES } from '../constants/todos';

@ObjectType()
export class TodoResponse {
  @Field(() => [FormError], { nullable: true })
  errors?: FormError[];

  @Field(() => [Todo], { nullable: true })
  todos?: Todo[];

  @Field(() => Todo, { nullable: true })
  todo?: Todo;

  @Field(() => Number, { nullable: true })
  count?: number;

  @Field(() => String, { nullable: true })
  message?: string;
}

@Resolver(Todo)
export class TodoResolver {
  // Fetches todos for user
  @Query(() => TodoResponse)
  @Authorized(AUTHORIZED_USER_TYPES)
  async todos(
    @Arg('limit') limit: number,
    @Arg('offset') offset: number,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const userId = req.session.userId;

      const todos: Todo[] = await Todo.find({
        where: {
          userId,
          deletedAt: null,
        },
        order: {
          createdAt: 'DESC',
        },
        take: limit,
        skip: offset,
      });

      const count = await Todo.count({ where: { userId, deletedAt: null } });

      return {
        todos,
        count,
      };
    } catch (error) {
      return {
        errors: [
          {
            field: 'exception',
            message: error instanceof Error ? error.message : undefined,
          },
        ],
      };
    }
  }

  // Creates new record based on request data
  @Mutation(() => TodoResponse)
  @Authorized(AUTHORIZED_USER_TYPES)
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
            message: error instanceof Error ? error.message : undefined,
          },
        ],
      };
    }
  }

  // Sets deletedAt
  @Mutation(() => TodoResponse)
  @Authorized(AUTHORIZED_USER_TYPES)
  async deleteTodo(
    @Arg('id') id: string,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo: Todo = await findTodoByIdForUserSession({
        id,
        userId: req.session.userId,
      });

      return {
        todo: await updateTodoWithProperties(todo, { deletedAt: new Date() }),
      };
    } catch (error) {
      return {
        errors: [
          {
            field: 'exception',
            message: error instanceof Error ? error.message : undefined,
          },
        ],
      };
    }
  }

  // Sets completedAt
  @Mutation(() => TodoResponse)
  @Authorized(AUTHORIZED_USER_TYPES)
  async completeTodo(
    @Arg('id') id: string,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo: Todo = await findTodoByIdForUserSession({
        id,
        userId: req.session.userId,
      });

      return {
        todo: await updateTodoWithProperties(todo, { completedAt: new Date() }),
      };
    } catch (error) {
      return {
        errors: [
          {
            field: 'exception',
            message: error instanceof Error ? error.message : undefined,
          },
        ],
      };
    }
  }

  // Nullifies completedAt
  @Mutation(() => TodoResponse)
  @Authorized(AUTHORIZED_USER_TYPES)
  async resetTodo(
    @Arg('id') id: string,
    @Ctx() { req }: ContextType,
  ): Promise<TodoResponse> {
    try {
      const todo: Todo = await findTodoByIdForUserSession({
        id,
        userId: req.session.userId,
      });

      return {
        todo: await updateTodoWithProperties(todo, { completedAt: undefined }),
      };
    } catch (error) {
      return {
        errors: [
          {
            field: 'exception',
            message: error instanceof Error ? error.message : undefined,
          },
        ],
      };
    }
  }

  // Updates Todo by id and request data
  @Mutation(() => TodoResponse)
  @Authorized(AUTHORIZED_USER_TYPES)
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

      return {
        todo: await updateTodoWithProperties(todo, data),
      };
    } catch (error) {
      return {
        errors: [
          {
            field: 'exception',
            message: error instanceof Error ? error.message : undefined,
          },
        ],
      };
    }
  }
}
