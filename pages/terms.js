import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const META = {
  ko: {
    title: '이용약관 | Text-Down',
    footer: '© 2024 Text-Down. 무료 온라인 텍스트 도구.',
    langBtn: '🇺🇸 English',
    heading: '이용약관',
    updated: '최종 업데이트: 2024년 1월 1일',
    sections: [
      { title: '서비스 개요', content: 'Text-Down(text-down.com)은 글자수 세기, 텍스트 정리, 변환 등 무료 온라인 텍스트 도구 서비스입니다. 본 서비스를 이용함으로써 아래 약관에 동의한 것으로 간주합니다.' },
      { title: '이용 조건', content: '본 서비스는 개인 및 상업적 목적 모두 무료로 사용할 수 있습니다. 서비스를 악용하거나 자동화된 방식으로 과도하게 사용하는 행위는 금지됩니다.' },
      { title: '면책 조항', content: 'Text-Down은 서비스 이용으로 인해 발생하는 어떠한 손해에 대해서도 책임을 지지 않습니다. 서비스는 "있는 그대로" 제공됩니다.' },
      { title: '약관 변경', content: '본 약관은 사전 고지 없이 변경될 수 있습니다. 변경 후 계속 이용 시 변경된 약관에 동의한 것으로 간주합니다.' },
    ],
  },
  en: {
    title: 'Terms of Service | Text-Down',
    footer: '© 2024 Text-Down. Free Online Text Tools.',
    langBtn: '🇰🇷 한국어',
    heading: 'Terms of Service',
    updated: 'Last updated: January 1, 2024',
    sections: [
      { title: 'Service Overview', content: 'Text-Down (text-down.com) is a free online text tool service for character counting, text cleaning, and conversion. By using this service, you agree to the terms below.' },
      { title: 'Terms of Use', content: 'This service is free for both personal and commercial use. Misuse or excessive automated use of the service is prohibited.' },
      { title: 'Disclaimer', content: 'Text-Down is not responsible for any damages arising from the use of this service. The service is provided "as is".' },
      { title: 'Changes to Terms', content: 'These terms may be updated without prior notice. Continued use of the service after changes constitutes acceptance of the updated terms.' },
    ],
  },
}

export default function TermsPage() {
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
            <Link href="/privacy" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>개인정보처리방침</Link>
          </div>
          <Link href="/admin" className="admin-link">admin</Link>
        </div>
      </footer>
    </>
  )
}
