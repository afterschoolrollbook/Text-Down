import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const META = {
  ko: {
    title: '개인정보처리방침 | Text-Down',
    footer: '© 2024 Text-Down. 무료 온라인 텍스트 도구.',
    langBtn: '🇺🇸 English',
    heading: '개인정보처리방침',
    updated: '최종 업데이트: 2024년 1월 1일',
    sections: [
      { title: '수집하는 정보', content: 'Text-Down은 어떠한 개인정보도 수집하지 않습니다. 입력한 텍스트는 브라우저에서만 처리되며 서버로 전송되지 않습니다.' },
      { title: '쿠키 및 광고', content: '서비스 개선을 위해 Google Analytics 및 Google AdSense를 사용할 수 있습니다. 광고 관련 쿠키는 Google의 개인정보처리방침에 따라 관리됩니다.' },
      { title: '제3자 서비스', content: 'Google AdSense 광고가 표시될 수 있으며, Google의 개인정보처리방침이 적용됩니다.' },
      { title: '문의', content: '개인정보 처리와 관련한 문의사항은 사이트 내 문의 채널을 통해 연락해 주세요.' },
    ],
  },
  en: {
    title: 'Privacy Policy | Text-Down',
    footer: '© 2024 Text-Down. Free Online Text Tools.',
    langBtn: '🇰🇷 한국어',
    heading: 'Privacy Policy',
    updated: 'Last updated: January 1, 2024',
    sections: [
      { title: 'Information We Collect', content: 'Text-Down does not collect any personal information. Text you enter is processed entirely in your browser and is never sent to any server.' },
      { title: 'Cookies & Advertising', content: 'We may use Google Analytics and Google AdSense to improve our service. Ad-related cookies are managed in accordance with Google\'s Privacy Policy.' },
      { title: 'Third-Party Services', content: 'Google AdSense ads may be displayed. Google\'s privacy policy applies to their services.' },
      { title: 'Contact', content: 'For any privacy-related inquiries, please reach out through the contact channel on the site.' },
    ],
  },
}

export default function PrivacyPage() {
  const [lang, setLang] = useState('ko')
  const t = META[lang]

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <div className="wrap header-inner">
          <Link href="/" className="logo">
            <span className="logo-text">Text<span>-Down</span></span>
          </Link>
          <button className="lang-btn" onClick={() => setLang(l => l === 'ko' ? 'en' : 'ko')}>{t.langBtn}</button>
        </div>
      </header>

      <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div style={{ maxWidth: 720 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>{t.heading}</h1>
          <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 40 }}>{t.updated}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {t.sections.map((s, i) => (
              <div key={i}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</h2>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap">
          <p className="footer-text">{t.footer}</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10 }}>
            <Link href="/blog" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>블로그</Link>
            <Link href="/faq" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>FAQ</Link>
            <Link href="/terms" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>이용약관</Link>
          </div>
          <Link href="/admin" className="admin-link">admin</Link>
        </div>
      </footer>
    </>
  )
}
