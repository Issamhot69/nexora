import { Pool } from 'pg'

const pool = new Pool({
  database: 'nexoro',
  host: 'localhost',
  port: 5432,
})

export default pool
