import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const DEFAULTS = {
  adsOn: true,
  soundDownBanner: false,
  thumbDownBanner: false,
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  try {
    const { data, error } = await supabase.from('settings').select('key, value')
    if (error) throw error
    const map = {}
    for (const row of data || []) { map[row.key] = row.value }
    res.status(200).json({
      adsOn:           map['site:ads_on']            ?? DEFAULTS.adsOn,
      soundDownBanner: map['site:sound_down_banner'] ?? DEFAULTS.soundDownBanner,
      thumbDownBanner: map['site:thumb_down_banner'] ?? DEFAULTS.thumbDownBanner,
    })
  } catch (err) {
    console.error('Supabase get error:', err)
    res.status(500).json({ error: 'DB 읽기 실패' })
  }
}
