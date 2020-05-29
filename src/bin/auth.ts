const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/
const USER_PASS_REGEXP = /^([^:]*):(.*)$/

function decodeBase64 (str: string) {
  return Buffer.from(str, 'base64').toString()
}

export default new class {
  check (string: string) {

    const match = CREDENTIALS_REGEXP.exec(string)

    if (!match)
      return undefined

    const userPass = USER_PASS_REGEXP.exec(decodeBase64(match[1]))

    if (!userPass)
      return undefined

    return { name: userPass[1], password: userPass[2] }
  }

  checkPass (ctx: any, user: string, pass: string) {

    const { name, password } = this.check(ctx.headers['authorization']) || {}

    if (name === user && password === pass) {
      return true
    } else {
      ctx.set('WWW-Authenticate', 'Basic realm=Passport')
      ctx.status = 401
      ctx.body = 'No Auth'
      return false
    }
  }
}