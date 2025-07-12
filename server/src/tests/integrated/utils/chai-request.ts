import chai from 'chai'
import { Express } from 'express'
import chaiHttp from 'chai-http'
chai.use(chaiHttp).should()

export default async (
  server: string | Express | ChaiHttp.Agent,
  verb: 'get' | 'patch' | 'put' | 'delete' | 'post',
  path: string,
  token?: string,
  data?: object
) => {
  return chai
    .request(server)
    [verb](path)
    .send(data)
    .auth(token!, { type: 'bearer' })
}
