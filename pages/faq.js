import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const META = {
  ko: {
    title: 'FAQ | Text-Down — 무료 텍스트 도구',
    desc: '글자수 세기, 공백 제거, 텍스트 변환 등 자주 묻는 질문을 확인하세요.',
    heading: '자주 묻는 질문',
    sub: 'Text-Down 사용에 관해 많이 물어보시는 질문을 모았습니다.',
    langBtn: '🇺🇸 English',
    footer: '© 2024 Text-Down. 무료 온라인 텍스트 도구.',
    faqs: [
      { q: 'Text-Down은 무료인가요?', a: '네, 모든 기능을 무료로 이용할 수 있습니다. 회원가입도 필요 없어요.' },
      { q: '입력한 텍스트가 서버에 저장되나요?', a: '아니요. 모든 처리는 브라우저에서 이루어지며 서버로 데이터가 전송되지 않습니다. 개인정보는 수집하지 않습니다.' },
      { q: '어떤 기능을 제공하나요?', a: '글자수 세기, 공백/줄바꿈 정리, 대소문자 변환, 텍스트 제거(HTML태그, 특수문자, 중복줄 등), 줄 정렬, 텍스트 비교(Diff) 기능을 제공합니다.' },
      { q: '모바일에서도 사용할 수 있나요?', a: '네, 모바일 브라우저에서도 동일하게 사용할 수 있습니다.' },
      { q: '텍스트 길이 제한이 있나요?', a: '별도의 길이 제한은 없습니다. 다만 매우 긴 텍스트는 브라우저 성능에 따라 처리 속도가 다를 수 있습니다.' },
    ],
  },
  en: {
    title: 'FAQ | Text-Down — Free Text Tools',
    desc: 'Find answers about character counting, text cleaning, conversion, and more.',
    heading: 'Frequently Asked Questions',
    sub: 'Everything you need to know about using Text-Down.',
    langBtn: '🇰🇷 한국어',
    footer: '© 2024 Text-Down. Free Online Text Tools.',
    faqs: [
      { q: 'Is Text-Down free?', a: 'Yes, all features are completely free. No sign-up required.' },
      { q: 'Is my text stored on your servers?', a: 'No. All processing happens in your browser. Your text is never sent to any server and no personal data is collected.' },
      { q: 'What tools are available?', a: 'Character counter, whitespace cleaner, case converter, text remover (HTML tags, special characters, duplicate lines, etc.), line sorter, and text diff comparison.' },
      { q: 'Does it work on mobile?', a: 'Yes, all tools work on mobile browsers.' },
      { q: 'Is there a text length limit?', a: 'There is no strict limit. However, very long texts may process slower depending on your browser performance.' },
    ],
  },
}

export default function FaqPage() {
  const [lang, setLang] = useState('ko')
  const [open, setOpen] = useState(null)

  const toggleLang = () => setLang(l => l === 'ko' ? 'en' : 'ko')
  const t = META[lang]

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <div className="wrap header-inner">
          <Link href="/" className="logo">
            <span className="logo-text">Text<span>-Down</span></span>
          </Link>
          <button className="lang-btn" onClick={toggleLang}>{t.langBtn}</button>
        </div>
      </header>

      <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
        <div style={{ maxWidth: 720 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 4 }}>{t.heading}</h1>
          <p style={{ color: 'var(--text3)', fontSize: 15, marginBottom: 40 }}>{t.sub}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {t.faqs.map((faq, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}
                >
                  {faq.q}
                  <span style={{ flexShrink: 0, color: 'var(--text3)' }}>{open === i ? '−' : '+'}</span>
                </button>
                {open === i && (
                  <div style={{ padding: '0 20px 16px', fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{faq.a}</div>
                )}
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
            <Link href="/privacy" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>개인정보처리방침</Link>
            <Link href="/terms" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>이용약관</Link>
          </div>
          <Link href="/admin" className="admin-link">admin</Link>
        </div>
      </footer>
    </>
  )
}
