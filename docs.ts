import { App } from './app'
import fastifySwagger from 'fastify-swagger'

// Serve docs based on the openapi spec at /api-docs.
const docsPlugin = async (app: App) => {
  await app.register(fastifySwagger, {
    routePrefix: '/api-docs',
    exposeRoute: true,
    openapi: {
      info: {
        title: 'Test openapi',
        description: 'testing fastify with openapi',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://localhost',
        },
      ],
      components: {
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'apiKey',
            in: 'header',
          },
        },
      },
    },
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  })
}

// @ts-ignore
docsPlugin[Symbol.for('skip-override')] = true

export default docsPlugin
