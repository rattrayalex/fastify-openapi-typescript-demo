# Full-stack TypeScript API Example

This repo contains an example of typed requests and responses in your server and client code
with `fastify` and `react-query`, using `json-schema-to-ts`, `fastify-swagger`, and `orval`.

You write code [like this](https://github.com/rattrayalex/fastify-openapi-typescript-demo/blob/main/create-todo.ts#L4-L42) on your backend:

```ts
const todo = {
  title: 'Create Todo',
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    done: { type: 'boolean' },
  },
  required: ['name'],
  additionalProperties: false,
} as const
type Todo = FromSchema<typeof todo>

const schema = {
  body: todo,
  response: {
    200: todo,
  },
}

type CreateTodo = { Body: Todo; Response: Todo }

app.post<CreateTodo>('/todo', { schema }, async (req, reply) => {
  const { body: todo } = req

  todo.name // string
  todo.description // string | undefined
  todo.done // boolean | undefined

  // @ts-expect-error
  todo.notthere

  return todo // also typechecked!
})
```

and get code [like this](https://github.com/rattrayalex/fastify-openapi-typescript-demo/blob/main/client/client.tsx#L9-L35) on your frontend:

```tsx
import { usePostTodo } from './generated/api-client'

const App = () => {
  const { mutate, data: { data: todo } = {}, isLoading, error } = usePostTodo()

  const handleClick = () =>
    mutate({ data: { name: 'A todo', description: 'Do stuff' } }) // typechecked!

  return (
    <div>
      <button onClick={handleClick}>Create a TODO</button>

      {isLoading ? (
        'loading...'
      ) : error ? (
        <>
          error! <pre>{error}</pre>
        </>
      ) : todo ? ( // fully typed! 
        <div>
          <div>Created TODO:</div>
          Name: {todo.name}
          Description: {todo.description}
          Done: {todo.done}
        </div>
      ) : null}
    </div>
  )
}
```
