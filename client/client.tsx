import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import { usePostTodo } from '../generated/api-client'

const queryClient = new QueryClient()

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

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.body.appendChild(document.createElement('div'))
)
