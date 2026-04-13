// pages/api/settings/password.js
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function sha256(str) {
  return createHash('sha256').update(str).digest('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers['x-admin-token']
  if (!process.env.ADMIN_SECRET_TOKEN || token !== process.env.ADMIN_SECRET_TOKEN) {
    return res.status(401).json({ error: '인증 실패' })
  }

  const { newPassword } = req.body
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: '비밀번호는 6자 이상이어야 합니다' })
  }

  try {
    const { error } = await supabase
      .from('settings')
      .upsert([{ key: 'admin:password_hash', value: sha256(newPassword) }], { onConflict: 'key' })

    if (error) throw error
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('password change error:', err)
    res.status(500).json({ error: '비밀번호 변경 실패' })
  }
}
