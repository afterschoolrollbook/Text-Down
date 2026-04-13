import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const SITE = 'text-down'

  // GET - 글 목록 or 개별 글
  if (req.method === 'GET') {
    const { slug } = req.query
    const token = req.headers['x-admin-token']
    const isAdmin = token === process.env.ADMIN_SECRET_TOKEN

    if (slug) {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('site', SITE)
        .eq('slug', slug)

      if (!isAdmin) query = query.eq('published', true)

      const { data, error } = await query.single()
      if (error || !data) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(data)
    }

    let query = supabase
      .from('blog_posts')
      .select('id, slug, title_ko, title_en, content_ko, content_en, description_ko, description_en, tags, published, created_at')
      .eq('site', SITE)
      .order('created_at', { ascending: false })

    if (!isAdmin) query = query.eq('published', true)

    const { data, error } = await query

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // POST - 글 작성 (관리자만)
  if (req.method === 'POST') {
    const token = req.headers['x-admin-token']
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { slug, title_ko, title_en, content_ko, content_en, description_ko, description_en, tags } = req.body

    if (!slug || !title_ko || !content_ko) {
      return res.status(400).json({ error: 'slug, title_ko, content_ko 필수' })
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{ site: SITE, slug, title_ko, title_en, content_ko, content_en, description_ko, description_en, tags }])
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  // PUT - 글 수정
  if (req.method === 'PUT') {
    const token = req.headers['x-admin-token']
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { id, ...fields } = req.body

    const { data, error } = await supabase
      .from('blog_posts')
      .update(fields)
      .eq('id', id)
      .eq('site', SITE)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // DELETE - 글 삭제
  if (req.method === 'DELETE') {
    const token = req.headers['x-admin-token']
    if (token !== process.env.ADMIN_SECRET_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { id } = req.body

    // blog_posts에서 slug 먼저 가져오기
    const { data: post } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('id', id)
      .eq('site', SITE)
      .single()

    // blog_posts 삭제
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
      .eq('site', SITE)

    if (error) return res.status(500).json({ error: error.message })

    // pipeline_logs에서 같은 slug 삭제
    if (post?.slug) {
      await supabase
        .from('pipeline_logs')
        .delete()
        .eq('slug', post.slug)
        .eq('site', SITE)
    }

    return res.status(200).json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
