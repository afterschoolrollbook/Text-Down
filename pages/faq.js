import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const FAQS = {
  ko: [
    {
      q: 'Text-Down은 무료인가요?',
      a: '네, 완전히 무료입니다. 회원가입이나 로그인 없이 바로 사용할 수 있습니다. 서비스 운영 비용은 Google AdSense 광고 수익으로 충당됩니다.',
    },
    {
      q: '어떤 화질로 다운로드할 수 있나요?',
      a: 'YouTube가 제공하는 모든 해상도를 선택할 수 있습니다. HD(maxresdefault, 1280×720), SD(sddefault, 640×480), HQ(hqdefault, 480×360), MQ(mqdefault, 320×180) 4가지 옵션을 지원합니다. 최고화질이 없는 영상은 자동으로 다음 화질로 대체됩니다.',
    },
    {
      q: '다운로드한 썸네일을 상업적으로 사용해도 되나요?',
      a: '다운로드된 썸네일의 저작권은 원 콘텐츠 제작자(유튜버) 또는 YouTube에 있습니다. 개인적인 참고나 비영리 목적 외의 상업적 사용은 저작권법 위반이 될 수 있으므로, 반드시 원 제작자의 허락을 받으세요.',
    },
    {
      q: '어떤 YouTube URL 형식을 지원하나요?',
      a: '표준 URL(youtube.com/watch?v=...), 짧은 URL(youtu.be/...), Shorts URL(youtube.com/shorts/...) 등 일반적인 모든 YouTube URL 형식을 지원합니다.',
    },
    {
      q: '모바일에서도 사용할 수 있나요?',
      a: '네, 스마트폰과 태블릿을 포함한 모든 기기에서 사용 가능합니다. 반응형 디자인으로 제작되어 화면 크기에 상관없이 편리하게 이용할 수 있습니다.',
    },
    {
      q: '썸네일이 표시되지 않거나 다운로드가 안 돼요.',
      a: 'YouTube URL이 올바른지 확인해 주세요. 비공개 영상이나 삭제된 영상은 썸네일을 가져올 수 없습니다. 일부 영상은 최고화질 썸네일이 없을 수 있으며, 이 경우 자동으로 낮은 화질로 표시됩니다. 문제가 지속되면 페이지를 새로고침 후 다시 시도해 주세요.',
    },
    {
      q: '입력한 URL은 서버에 저장되나요?',
      a: '아니요. 입력한 YouTube URL은 브라우저에서만 처리되며 어떤 서버에도 저장되지 않습니다. 개인정보는 수집하지 않습니다.',
    },
    {
      q: 'Sound-Down은 무엇인가요?',
      a: 'Sound-Down(sound-down.com)은 Text-Down의 자매 서비스입니다. 유튜버, 크리에이터, 영상 편집자를 위한 무료 효과음 다운로드 사이트로, CC0 라이선스 음원만 제공하여 저작권 걱정 없이 사용할 수 있습니다.',
    },
  ],
  en: [
    {
      q: 'Is Text-Down free to use?',
      a: 'Yes, completely free. No sign-up or login required. The service is supported by Google AdSense advertising revenue.',
    },
    {
      q: 'What quality options are available for download?',
      a: 'All resolutions provided by YouTube are available: HD (maxresdefault, 1280×720), SD (sddefault, 640×480), HQ (hqdefault, 480×360), and MQ (mqdefault, 320×180). If the highest quality is unavailable for a video, the next best quality is used automatically.',
    },
    {
      q: 'Can I use downloaded thumbnails commercially?',
      a: 'Downloaded thumbnails are owned by the original content creator or YouTube. Commercial use beyond personal reference may constitute copyright infringement. Always get permission from the original creator before any commercial use.',
    },
    {
      q: 'What YouTube URL formats are supported?',
      a: 'All common YouTube URL formats are supported: standard URLs (youtube.com/watch?v=...), short URLs (youtu.be/...), and Shorts URLs (youtube.com/shorts/...).',
    },
    {
      q: 'Does it work on mobile devices?',
      a: 'Yes, it works on all devices including smartphones and tablets. The site is fully responsive and works great on any screen size.',
    },
    {
      q: 'The thumbnail is not showing or download is not working.',
      a: 'Please verify the YouTube URL is correct. Private or deleted videos cannot be accessed. Some videos may not have a max-resolution thumbnail, in which case a lower quality is shown automatically. If the issue persists, try refreshing the page.',
    },
    {
      q: 'Is my URL saved on your servers?',
      a: 'No. The YouTube URL you enter is processed entirely in your browser and is never stored on any server. We do not collect personal information.',
    },
    {
      q: 'What is Sound-Down?',
      a: 'Sound-Down (sound-down.com) is a sister service to Text-Down. It is a free sound effects download site for YouTubers, creators, and video editors, offering only CC0-licensed audio so you can use sounds without any copyright concerns.',
    },
  ],
}

const META = {
  ko: {
    title: '자주 묻는 질문 (FAQ) | Text-Down',
    desc: '유튜브 썸네일 다운로드 방법, 화질 선택, 저작권, 무료 여부 등 자주 묻는 질문을 확인하세요.',
    heading: '자주 묻는 질문',
    sub: '유튜브 썸네일 다운로드에 관해 많이 물어보시는 질문을 모았습니다.',
    contactTitle: '더 궁금한 점이 있으신가요?',
    contactDesc: 'minsiljjag@gmail.com 으로 문의해 주시면 빠르게 답변해 드리겠습니다.',
    linkPrivacy: '개인정보처리방침 →',
    linkTerms: '이용약관 →',
    footer: '© 2024 Text-Down. 유튜브 썸네일 무료 다운로더.',
    langBtn: '🇺🇸 English',
  },
  en: {
    title: 'FAQ | Text-Down — YouTube Thumbnail Downloader',
    desc: 'Find answers about downloading YouTube thumbnails, quality options, copyright, and more.',
    heading: 'Frequently Asked Questions',
    sub: 'Everything you need to know about downloading YouTube thumbnails.',
    contactTitle: 'Still have questions?',
    contactDesc: 'Reach us at minsiljjag@gmail.com and we\'ll get back to you quickly.',
    linkPrivacy: 'Privacy Policy →',
    linkTerms: 'Terms of Service →',
    footer: '© 2024 Text-Down. Free YouTube Thumbnail Downloader.',
    langBtn: '🇰🇷 한국어',
  },
}

export default function Faq() {
  const [lang, setLang] = useState('ko')
  const [open, setOpen] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('yt_lang')
    if (saved && META[saved]) setLang(saved)
  }, [])

  const toggleLang = () => {
    const next = lang === 'ko' ? 'en' : 'ko'
    setLang(next)
    setOpen(null)
    localStorage.setItem('yt_lang', next)
  }

  const t = META[lang]
  const faqs = FAQS[lang]

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <>
      <Head>
        <title>{t.title}</title>
        <meta name="description" content={t.desc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
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
            {t.heading}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 48 }}>{t.sub}</p>

          <div className="faq-list">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className={`faq-item${open === i ? ' open' : ''}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="faq-q">
                  <span>{q}</span>
                  <span className="faq-icon">{open === i ? '−' : '+'}</span>
                </div>
                {open === i && <div className="faq-a">{a}</div>}
              </div>
            ))}
          </div>

          <div className="contact-box">
            <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{t.contactTitle}</p>
            <p style={{ fontSize: 13, color: 'var(--text3)' }}>{t.contactDesc}</p>
          </div>

          <div style={{ marginTop: 32, display: 'flex', gap: 16 }}>
            <Link href="/privacy" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkPrivacy}</Link>
            <Link href="/terms" style={{ color: 'var(--text3)', fontSize: 13, textDecoration: 'none' }}>{t.linkTerms}</Link>
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
        .faq-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 40px; }
        .faq-item {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 18px 20px;
          cursor: pointer; transition: border-color 0.2s; user-select: none;
        }
        .faq-item:hover { border-color: #444; }
        .faq-item.open { border-color: var(--accent); }
        .faq-q {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; font-size: 15px; font-weight: 600; color: var(--text);
        }
        .faq-icon { color: var(--accent); font-size: 20px; font-weight: 400; line-height: 1; flex-shrink: 0; }
        .faq-a {
          margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border);
          font-size: 14px; color: var(--text2); line-height: 1.8;
        }
        .contact-box {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 24px 28px;
        }
      `}</style>
    </>
  )
}
