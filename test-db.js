import { neon } from '@neondatabase/serverless'
import 'dotenv/config'

const sql = neon(process.env.DATABASE_URL)
async function main() {
  console.log(await sql`select 1 as ok`)
  console.log(await sql`select * from users limit 1`)
}
main().catch(console.error)