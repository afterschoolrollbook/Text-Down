// pages/api/settings/password.js
// 관리자 비밀번호 변경 — Supabase에 SHA-256 해시로 저장

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

  const { currentPw, newPw } = req.body
  if (!currentPw || !newPw) return res.status(400).json({ error: '입력값 부족' })
  if (newPw.length < 6) return res.status(400).json({ error: '새 비밀번호는 6자 이상' })

  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin:password_hash')
      .single()

    const defaultHash = sha256(process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin1234')
    const validHash = data?.value ?? defaultHash

    if (sha256(currentPw) !== validHash) {
      return res.status(401).json({ error: '현재 비밀번호가 틀렸습니다' })
    }

    // 새 비밀번호 해시 upsert
    const { error } = await supabase
      .from('settings')
      .upsert({ key: 'admin:password_hash', value: sha256(newPw) }, { onConflict: 'key' })

    if (error) throw error

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Supabase password error:', err)
    res.status(500).json({ error: 'DB 저장 실패' })
  }
}
