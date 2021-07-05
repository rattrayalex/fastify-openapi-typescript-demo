import orval from 'orval'
import { promises as fs } from 'fs'
import { execSync } from 'child_process'
import { App } from './app'

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms, null))

export default async (app: App) => {
  app.ready(async () => {
    if (process.env.NODE_ENV !== 'development') return

    if (!(await fs.stat('./generated').catch(() => false))) {
      await fs.mkdir('./generated')
    }

    console.log('Generating openapi spec…')
    const oas = await app.swagger()

    // Writing to file until https://github.com/anymaniax/orval/issues/179 is resolved
    await fs.writeFile('./generated/openapi.json', JSON.stringify(oas, null, 2))

    console.log('Generating api client…')
    await orval({
      input: {
        target: 'generated/openapi.json',
        validation: false,
      },
      output: {
        target: 'generated/api-client.ts',
        client: 'react-query',
      },
    })
    await sleep(10) // orval exits before the file has been written: https://github.com/anymaniax/orval/issues/180

    execSync('yarn prettier --write generated/api-client.ts')

    execSync('yarn webpack')
  })
  return Promise.resolve()
}
