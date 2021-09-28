import { Todo } from '../../entity/Todo';
import { TodoProps } from '../../inputs/TodoInput';

export const updateTodoWithProperties = async (
  todo: Todo,
  properties: TodoProps,
): Promise<Todo> => {
  Object.assign(todo, { ...properties });

  await todo.save();

  return todo;
};
