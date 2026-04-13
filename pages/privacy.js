import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const CONTENT = {
  ko: {
    metaTitle: '개인정보처리방침 | Text-Down',
    metaDesc: 'Text-Down 개인정보처리방침 — 수집 정보, 이용 목적, 보관 기간을 안내합니다.',
    title: '개인정보처리방침',
    updated: '최종 업데이트: 2025년 1월 1일',
    sections: [
      {
        title: '1. 수집하는 정보',
        content: 'Text-Down은 서비스 제공을 위해 아래와 같은 정보를 처리할 수 있습니다.',
        items: [
          '입력한 YouTube URL (서버에 저장되지 않음, 브라우저에서만 처리)',
          'Google AdSense를 통한 쿠키 및 광고 관련 데이터',
          'Google Analytics를 통한 방문 통계 (익명 처리됨)',
        ],
      },
      {
        title: '2. 정보 이용 목적',
        content: '수집된 정보는 다음 목적으로만 사용됩니다.',
        items: [
          'YouTube 썸네일 다운로드 기능 제공',
          '서비스 품질 개선 및 통계 분석',
          'Google AdSense 맞춤형 광고 표시',
        ],
      },
      {
        title: '3. 정보 보관 및 파기',
        content: '입력된 YouTube URL은 어떠한 서버에도 저장되지 않으며, 브라우저 세션 종료 시 자동으로 삭제됩니다. 광고 관련 쿠키는 Google의 개인정보처리방침에 따라 관리됩니다.',
      },
      {
        title: '4. 제3자 제공',
        content: 'Text-Down은 수집한 개인정보를 제3자에게 제공하지 않습니다. 단, Google AdSense 및 Google Analytics 서비스 이용 시 해당 서비스의 약관이 적용됩니다.',
        items: ['Google 개인정보처리방침: policies.google.com/privacy'],
      },
      {
        title: '5. 쿠키 사용',
        content: '본 사이트는 Google AdSense 광고 최적화를 위해 쿠키를 사용합니다. 브라우저 설정을 통해 쿠키를 비활성화할 수 있으나, 일부 기능이 제한될 수 있습니다.',
      },
      {
        title: '6. 이용자의 권리',
        content: '이용자는 언제든지 아래 방법으로 개인정보 관련 문의를 할 수 있습니다.',
        items: ['이메일: minsiljjag@gmail.com', '처리 기간: 요청일로부터 7일 이내'],
      },
      {
        title: '7. 개인정보처리방침 변경',
        content: '본 방침은 법령 또는 서비스 변경에 따라 수정될 수 있습니다. 변경 시 본 페이지를 통해 안내합니다.',
      },
    ],
    linkTerms: '이용약관 →',
    linkFaq: '자주 묻는 질문 →',
    footer: '© 2024 Text-Down. 유튜브 썸네일 무료 다운로더.',
    langBtn: '🇺🇸 English',
  },
  en: {
    metaTitle: 'Privacy Policy | Text-Down',
    metaDesc: 'Text-Down Privacy Policy — learn what information we collect and how we use it.',
    title: 'Privacy Policy',
    updated: 'Last updated: January 1, 2025',
    sections: [
      {
        title: '1. Information We Collect',
        content: 'Text-Down may process the following information to provide our service.',
        items: [
          'YouTube URLs you enter (never stored on any server — processed in your browser only)',
          'Cookie and ad-related data via Google AdSense',
          'Anonymous visit statistics via Google Analytics',
        ],
      },
      {
        title: '2. How We Use Information',
        content: 'Collected information is used solely for the following purposes.',
        items: [
          'Providing the YouTube thumbnail download feature',
          'Improving service quality and analyzing usage statistics',
          'Displaying personalized ads via Google AdSense',
        ],
      },
      {
        title: '3. Data Retention & Deletion',
        content: "YouTube URLs you enter are never stored on any server and are automatically cleared when you close your browser session. Ad-related cookies are managed in accordance with Google's Privacy Policy.",
      },
      {
        title: '4. Third-Party Sharing',
        content: "Text-Down does not share your personal information with third parties. However, when using Google AdSense or Google Analytics, those services' own terms apply.",
        items: ['Google Privacy Policy: policies.google.com/privacy'],
      },
      {
        title: '5. Cookies',
        content: 'This site uses cookies to optimize Google AdSense ads. You may disable cookies in your browser settings, though some features may be limited.',
      },
      {
        title: '6. Your Rights',
        content: 'You may contact us at any time with privacy-related inquiries.',
        items: ['Email: minsiljjag@gmail.com', 'Response time: within 7 days'],
      },
      {
        title: '7. Changes to This Policy',
        content: 'This policy may be updated due to legal or service changes. Updates will be announced on this page.',
      },
    ],
    linkTerms: 'Terms of Service →',
    linkFaq: 'FAQ →',
    footer: '© 2024 Text-Down. Free YouTube Thumbnail Downloader.',
    langBtn: '🇰🇷 한국어',
  },
}

export default function Privacy() {
  const [lang, setLang] = useState('ko')

  useEffect(() => {
    const saved = localStorage.getItem('yt_lang')
    if (saved && CONTENT[saved]) setLang(saved)
  }, [])

  const toggleLang = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    setLang(next)
    localStorage.setItem('yt_lang', next)
  }

  const t = CONTENT[lang]

  return (
    <>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <div className="wrap header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">▶</div>
            <span className="logo-text">Thumb<span>-Down</span></span>
          </Link>
          <button className="lang-btn" onClick={toggleLang}>{t.langBtn}</button>
        </div>
      </header>

      <main className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ maxWidth: 680 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 6 }}>
            {t.title}
          </h1>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 48 }}>{t.updated}</p>

          {t.sections.map((s, i) => (
            <div key={i} className="section">
              <h2 className="section-title">{s.title}</h2>
              <div className="section-body">
                {s.content && <p>{s.content}</p>}
                {s.items && (
                  <ul>
                    {s.items.map((item, j) => (
                      <li key={j}>
                        {item.includes('policies.google.com') ? (
                          <>
                            {lang === 'ko' ? 'Google 개인정보처리방침: ' : 'Google Privacy Policy: '}
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                              policies.google.com/privacy
                            </a>
                          </>
                        ) : item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 48, display: 'flex', gap: 16 }}>
            <Link href="/terms" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkTerms}</Link>
            <Link href="/faq" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkFaq}</Link>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-text">{t.footer}</p>
          <Link href="/admin" className="admin-link">admin</Link>
        </div>
      </footer>

      <style jsx>{`
        .section { margin-bottom: 40px; }
        .section-title {
          font-size: 15px; font-weight: 700; color: var(--text);
          margin-bottom: 14px; padding-left: 12px;
          border-left: 3px solid var(--accent);
        }
        .section-body { color: var(--text2); font-size: 14px; line-height: 1.85; }
        .section-body p { margin-bottom: 8px; }
        .section-body ul { list-style: disc; padding-left: 20px; margin-top: 8px; }
        .section-body ul li { margin-bottom: 4px; }
        .section-body a:hover { text-decoration: underline; }
      `}</style>
    </>
  )
}
