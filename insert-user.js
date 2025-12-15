import { neon } from '@neondatabase/serverless'
import 'dotenv/config' // читает .env

async function main() {
  const sql = neon(process.env.DATABASE_URL)
  await sql`insert into users (id) values ('dev-user') on conflict (id) do nothing`
  console.log(await sql`select * from users`)
}

main().catch(console.error)