#!/usr/bin/env node --unhandled-rejections=strict -r ts-node/register

import fastify, { FastifyInstance } from 'fastify'
import fastifyStatic from 'fastify-static'
import { Server, IncomingMessage, ServerResponse } from 'http'
import docs from './docs'
import generateClient from './generate-client'
import createTodo from './create-todo'

export type App = FastifyInstance<Server, IncomingMessage, ServerResponse>
const app: App = fastify()

app.register(docs)
app.register(generateClient)
app.register(fastifyStatic, { root: __dirname + '/client' })

app.register(createTodo)

const start = async () => {
  await app.listen(3000)
}

start()
