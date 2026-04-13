/**
 * /api/download
 * 유튜브 썸네일 이미지를 프록시해서 다운로드 헤더와 함께 전달
 * (CORS 우회 + attachment 헤더로 직접 다운로드 유도)
 */
export default async function handler(req, res) {
  const { url } = req.query

  // 유튜브 썸네일 URL만 허용 (보안)
  if (!url || !url.startsWith('https://img.youtube.com/vi/')) {
    return res.status(403).json({ error: 'Invalid URL' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    })

    if (!response.ok) {
      return res.status(404).json({ error: 'Thumbnail not found' })
    }

    const buffer = await response.arrayBuffer()

    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Content-Disposition', 'attachment; filename="youtube_thumbnail.jpg"')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.send(Buffer.from(buffer))
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch thumbnail' })
  }
}
