// pages/api/settings/get.js
// Supabase에서 설정값 읽기
//
// 설치: npm install @supabase/supabase-js
// Vercel Storage → Supabase → Create → 프로젝트 연결
// → 환경변수 SUPABASE_URL, SUPABASE_ANON_KEY 자동 추가됨
//
// Supabase 대시보드 → SQL Editor에서 테이블 생성:
// CREATE TABLE settings (
//   key TEXT PRIMARY KEY,
//   value JSONB NOT NULL
// );

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // 서버사이드는 service_role 키 사용
)

const DEFAULTS = {
  cooldown: 12,
  adsOn: true,
  soundDownBanner: false,
  affiliateLinks: {
    tubebuddy:     'https://www.tubebuddy.com/pricing?a=YOUR_ID',
    canva:         'https://partner.canva.com/YOUR_ID',
    envato:        'https://elements.envato.com/?ref=YOUR_ID',
    vidiq:         'https://vidiq.com/#_YOUR_ID',
    epidemicSound: 'https://www.epidemicsound.com/?utm_source=affiliate&utm_medium=YOUR_ID',
  },
  affiliateEnabled: {
    tubebuddy: true,
    canva: true,
    envato: true,
    vidiq: true,
    epidemicSound: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')

    if (error) throw error

    // 배열 → { key: value } 객체로 변환
    const map = {}
    for (const row of data || []) {
      map[row.key] = row.value
    }

    res.status(200).json({
      cooldown:         map['site:cooldown']        ?? DEFAULTS.cooldown,
      adsOn:            map['site:ads_on']           ?? DEFAULTS.adsOn,
      soundDownBanner:  map['site:sound_down_banner'] ?? DEFAULTS.soundDownBanner,
      affiliateLinks:   map['affiliate:links']       ?? DEFAULTS.affiliateLinks,
      affiliateEnabled: map['affiliate:enabled']     ?? DEFAULTS.affiliateEnabled,
    })
  } catch (err) {
    console.error('Supabase get error:', err)
    res.status(500).json({ error: 'DB 읽기 실패' })
  }
}
