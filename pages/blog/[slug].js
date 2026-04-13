import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query
  const [lang, setLang] = useState('ko')
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('yt_lang')
    if (saved === 'en') setLang('en')
  }, [])

  useEffect(() => {
    if (!slug) return
    fetch(`/api/blog/posts?slug=${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setPost(data); setLoading(false) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  const toggleLang = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    setLang(next)
    localStorage.setItem('yt_lang', next)
  }

  const title = post ? (lang === 'ko' ? post.title_ko : (post.title_en || post.title_ko)) : ''
  const content = post ? (lang === 'ko' ? post.content_ko : (post.content_en || post.content_ko)) : ''
  const description = post ? (lang === 'ko' ? post.description_ko : (post.description_en || post.description_ko)) : ''

  const formatDate = (iso) => {
    const d = new Date(iso)
    return lang === 'ko'
      ? `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <>
      <Head>
        <title>{title ? `${title} | Text-Down` : 'Text-Down 블로그'}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <div className="wrap header-inner">
          <Link href="/" className="logo">
            <span className="logo-text">Text<span>-Down</span></span>
          </Link>
          <button className="lang-btn" onClick={toggleLang}>{lang === 'ko' ? '🇺🇸 English' : '🇰🇷 한국어'}</button>
        </div>
      </header>

      <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div style={{ maxWidth: 720 }}>
          <Link href="/blog" style={{ color: '#888', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>← 블로그 목록</Link>

          {loading && <div style={{ color: '#aaa', fontSize: 14 }}>불러오는 중...</div>}
          {notFound && <div style={{ color: '#aaa', fontSize: 14 }}>글을 찾을 수 없습니다.</div>}

          {post && (
            <>
              <div style={{ marginBottom: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {post.tags && post.tags.map(tag => (
                  <span key={tag} className="post-tag">{tag}</span>
                ))}
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 8, lineHeight: 1.3 }}>{title}</h1>
              <p style={{ color: '#aaa', fontSize: 13, marginBottom: 40 }}>{formatDate(post.created_at)}</p>
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-text">© 2024 Text-Down. 무료 온라인 텍스트 도구.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10 }}>
            <Link href="/blog" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>블로그</Link>
            <Link href="/faq" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>FAQ</Link>
            <Link href="/privacy" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>개인정보처리방침</Link>
            <Link href="/terms" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>이용약관</Link>
          </div>
          <Link href="/admin" className="admin-link">admin</Link>
        </div>
      </footer>

      <style jsx>{`
        .blog-content h2 { font-size: 20px; font-weight: 700; margin: 32px 0 12px; }
        .blog-content p { font-size: 15px; color: var(--text2); line-height: 1.8; margin-bottom: 16px; }
        .blog-content ul, .blog-content ol { padding-left: 20px; margin-bottom: 16px; }
        .blog-content li { font-size: 15px; color: var(--text2); line-height: 1.8; margin-bottom: 6px; }
        .blog-content strong { color: var(--text); font-weight: 700; }
      `}</style>
    </>
  )
}
