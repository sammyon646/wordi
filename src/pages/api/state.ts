import type { NextApiRequest, NextApiResponse } from 'next'
import { neon } from '@neondatabase/serverless'
import crypto from 'crypto'

type TgUser = { id: number; first_name?: string; last_name?: string; username?: string }

const connStr = process.env.DATABASE_URL
if (!connStr) throw new Error('DATABASE_URL is not set')
const sql = neon(connStr)

const BOT_TOKEN = process.env.BOT_TOKEN || ''

// Проверка initData из Telegram WebApp
function checkTelegramAuth(initData?: string): TgUser | null {
  if (!initData) return null
  const params = new URLSearchParams(initData)
  const hash = params.get('hash')
  params.delete('hash')

  const dataCheckString = [...params.entries()]
    .sort(([a, b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n')

  const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest()
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex')
  if (hmac !== hash) return null

  const userStr = params.get('user')
  if (!userStr) return null
  return JSON.parse(userStr) as TgUser
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const initData =
    req.method === 'GET'
      ? (typeof req.query.initData === 'string' ? req.query.initData : undefined)
      : (typeof req.body?.initData === 'string' ? req.body.initData : undefined)

  const user = checkTelegramAuth(initData)
  const userId =
    user?.id ? String(user.id) : process.env.NODE_ENV === 'development' ? 'dev-user' : null
  if (!userId) return res.status(401).json({ error: 'unauthorized' })

  if (req.method === 'GET') {
    try {
      const rows = await sql`select * from users where id = ${userId}`
      if (!rows.length) {
        await sql`insert into users (id) values (${userId}) on conflict (id) do nothing`
        return res.json({
          user: {
            id: userId,
            coins: 0,
            level: 1,
            puzzle_index: 0,
            solved: {},
            selected_theme: 'purple',
            selected_wallpaper: 'wave',
            unlocked_themes: ['purple'],
            unlocked_wallpapers: ['wave'],
          },
        })
      }
      return res.json({ user: rows[0] })
    } catch (e) {
      console.error('GET /api/state error', e)
      return res.status(500).json({ error: 'db_error', detail: String(e) })
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        coins,
        level,
        puzzleIndex,
        solved,
        selectedTheme,
        selectedWallpaper,
        unlockedThemes,
        unlockedWallpapers,
      } = req.body.state || {}

      await sql`
        insert into users (id, coins, level, puzzle_index, solved,
                           selected_theme, selected_wallpaper,
                           unlocked_themes, unlocked_wallpapers)
        values (${userId}, ${coins}, ${level}, ${puzzleIndex},
                ${JSON.stringify(solved || {})},
                ${selectedTheme || 'purple'},
                ${selectedWallpaper || 'wave'},
                ${JSON.stringify(unlockedThemes || ['purple'])},
                ${JSON.stringify(unlockedWallpapers || ['wave'])})
        on conflict (id) do update set
          coins = excluded.coins,
          level = excluded.level,
          puzzle_index = excluded.puzzle_index,
          solved = excluded.solved,
          selected_theme = excluded.selected_theme,
          selected_wallpaper = excluded.selected_wallpaper,
          unlocked_themes = excluded.unlocked_themes,
          unlocked_wallpapers = excluded.unlocked_wallpapers
      `
      return res.json({ ok: true })
    } catch (e) {
      console.error('POST /api/state error', e)
      return res.status(500).json({ error: 'db_error', detail: String(e) })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end('Method Not Allowed')
}