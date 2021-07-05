import { FromSchema } from 'json-schema-to-ts'
import { App } from './app'

const todo = {
  title: 'Create Todo',
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    done: { type: 'boolean' },
  },
  additionalProperties: false,
  required: ['name'],
} as const

type Todo = FromSchema<typeof todo>

const opts = {
  schema: {
    body: todo,
    response: {
      200: todo,
    },
  },
}

type CreateTodo = { Body: Todo; Response: Todo }

export default async (app: App) => {
  await app.post<CreateTodo>('/todo', opts, async (req, reply) => {
    const { body: todo } = req

    todo.name // string
    todo.description // string | undefined
    todo.done // boolean | undefined

    // @ts-expect-error
    todo.notthere

    return todo // also typechecked!
  })
}
