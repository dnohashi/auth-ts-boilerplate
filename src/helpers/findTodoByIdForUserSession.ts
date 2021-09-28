import { ForbiddenError, UserInputError } from 'apollo-server';
import { Todo } from '../entity/Todo';

interface IFindTodoByIdForUserSessionProps {
  id: string;
  userId: string;
}

export const findTodoByIdForUserSession = async ({
  id,
  userId,
}: IFindTodoByIdForUserSessionProps): Promise<Todo> => {
  const todo: Todo | undefined = await Todo.findOne({
    where: { id },
  });

  if (!todo) {
    throw new UserInputError('Todo could not be found', {
      field: 'todo',
    });
  }

  if (todo.userId !== userId) {
    throw new ForbiddenError('Forbidden');
  }

  return todo;
};
