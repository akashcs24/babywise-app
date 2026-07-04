import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'babywise-prototype-v1'

const ASSETS = {
  logo: '/assets/Splash_Logo.svg',
  menu: '/assets/ic-menu-item.svg',
  bell: '/assets/bell.svg',
  add: '/assets/add-01.svg',
  brain: '/assets/ai-brain-01.svg',
  avatarBoy: '/assets/Baby boy avatar.png',
  avatarGirl: '/assets/Baby girl avatar.png',
  avatarMom: '/assets/Mother Avatar.png',
  trust: '/assets/heart-handshake.svg',
  review: '/assets/award-05.svg',
  plan: '/assets/notebook-02.svg',
  stories: '/assets/teaching.svg',
  arrow: '/assets/arrow-up-01-1.svg',
  hourglass: '/assets/hourglass.svg',
  cancel: '/assets/logout-square-02.svg',
  loader: '/assets/loader.svg',
  tick: '/assets/tick-03.svg',
  report: '/assets/ai-magic.svg',
  doctor: '/assets/doctor-01.svg',
  location: '/assets/location-03.svg',
  heart: '/assets/heart.svg',
  one: '/assets/one-square.svg',
  two: '/assets/two-square.svg',
  three: '/assets/three-square.svg',
}

const loaderStates = [
  {
    title: 'Reviewing responses',
    body: 'Remember, this is a starting point, not a verdict',
  },
  {
    title: 'Mapping patterns',
    body: 'We are connecting the patterns you shared across speech, connection, and play.',
  },
  {
    title: 'Preparing next steps',
    body: 'Your personalised next steps are almost ready.',
  },
]

const actionNumberIcons = ['/assets/one-square.svg', '/assets/two-square.svg', '/assets/three-square.svg']

const LOADER_HOLD_MS = 500
const LOADER_TRAVEL_MS = 500
const LOADER_FINAL_GAP_MS = 300

const sectionMeta = [
  {
    id: 'speech',
    title: 'Section 1: Speech',
    heading: 'Let’s start with how Avyan communicates',
    minutes: 'About 1.5 minutes',
  },
  {
    id: 'connection',
    title: 'Section 2: Connection',
    heading: 'Let’s see how Avyan connects with people around him.',
    minutes: 'About 1.5 minutes',
  },
  {
    id: 'play',
    title: 'Section 3: Play',
    heading: 'Now let’s look at how Avyan plays and explores.',
    minutes: 'About 2 minutes',
  },
]

const optionSets = {
  milestone: ['Yes, now', 'Not yet', 'Used to before, not now', 'Not sure'],
  frequency: ['Always', 'Sometimes', 'Rarely', 'Never'],
  screenTime: ['Under 1 hour', '1 to 2 hours', '2 to 4 hours', 'More than 4 hours'],
}

const scoring = {
  milestone: {
    'Yes, now': 0,
    'Not sure': 1,
    'Not yet': 2,
    'Used to before, not now': 3,
  },
  frequency: {
    Never: 0,
    Rarely: 1,
    Sometimes: 2,
    Always: 3,
  },
  screenTime: {
    'Under 1 hour': 0,
    '1 to 2 hours': 1,
    '2 to 4 hours': 2,
    'More than 4 hours': 3,
  },
}

const questions = [
  {
    section: 0,
    text: 'Does your child let you know what they want using sounds, words, or pointing?',
    optionType: 'milestone',
  },
  {
    section: 0,
    text: 'Does your child try to copy sounds or words you say?',
    optionType: 'milestone',
  },
  {
    section: 0,
    text: 'Can your child follow a simple instruction like “come here” or “give it to me”?',
    optionType: 'milestone',
  },
  {
    section: 0,
    text: 'Does your child say at least 4 to 5 words with clear meaning, like “mama,” “water,” or “no”?',
    optionType: 'milestone',
  },
  {
    section: 0,
    text: 'Does your child combine two words to express something, like “more milk” or “daddy go”?',
    optionType: 'milestone',
  },
  {
    section: 1,
    text: 'Does your child make eye contact with you during play or conversation?',
    optionType: 'milestone',
  },
  {
    section: 1,
    text: 'Does your child look up or turn when you call their name?',
    optionType: 'milestone',
  },
  {
    section: 1,
    text: 'Does your child copy actions like waving, clapping, or peekaboo?',
    optionType: 'milestone',
  },
  {
    section: 1,
    text: 'Does your child show interest in other children or try to join their play?',
    optionType: 'milestone',
  },
  {
    section: 1,
    text: 'Does your child respond more strongly to a screen than to a person, toy, or activity?',
    optionType: 'frequency',
  },
  {
    section: 2,
    text: 'Does your child engage in pretend play, like feeding a toy, pretending to cook, or talking to a doll?',
    optionType: 'milestone',
  },
  {
    section: 2,
    text: 'Can your child stay with a simple activity like blocks or books for more than 2 minutes without needing a screen?',
    optionType: 'milestone',
  },
  {
    section: 2,
    text: 'Does your child recognise and respond to familiar objects or pictures in books?',
    optionType: 'milestone',
  },
  {
    section: 2,
    text: 'Does your child need a screen to eat meals?',
    optionType: 'frequency',
  },
  {
    section: 2,
    text: 'How many hours of screen time does your child get on most days?',
    optionType: 'screenTime',
  },
]

const stories = [
  'We switched to 10 minutes of face-to-face play before dinner, and he started responding to his name more consistently in two weeks.',
  'The checklist helped us organise what we were seeing. We took that note to our paediatrician and got clearer guidance.',
  'The result did not scare us. It gave us a plan for this week, and that made us feel more in control.',
]

function scoreToTier(total) {
  if (total <= 14) return 'early'
  if (total <= 29) return 'clear'
  return 'urgent'
}

function getResultKey(total) {
  // Perfect pattern across all questions: show dedicated on-track framing.
  if (total === 0) return 'allGood'
  return scoreToTier(total)
}

const resultCopy = {
  allGood: {
    headline: 'Great signs right now. Avyan appears on track.',
    meaning:
      'Your responses show strong, consistent progress across speech, connection, and play. This is an encouraging snapshot, not a final label. Keep nurturing these everyday habits to support continued growth.',
    actions: [
      {
        title: 'Protect daily face-to-face time',
        body: 'Keep two short moments each day for play, songs, and turn-taking. Consistency helps maintain these strengths.',
      },
      {
        title: 'Keep language-rich routines',
        body: 'Continue naming actions, feelings, and objects during meals and play so communication keeps expanding naturally.',
      },
      {
        title: 'Recheck gently after a few weeks',
        body: 'Repeat this check in 8 to 12 weeks, or sooner if anything feels different. Early noticing always helps.',
      },
    ],
    cta: 'Continue growth activities',
    link: 'Set a reminder to reassess in 8 to 12 weeks',
    empathy: 'You noticed. You nurtured. This foundation matters.',
    empathyTitleSentences: 2,
  },
  early: {
    headline: 'Mostly on track, with a few things worth watching.',
    meaning:
      'Most of what you shared points to steady, healthy development. A few areas are simply worth keeping an eye on over the coming weeks. Small, everyday moments make the biggest difference.',
    actions: [
      {
        title: 'Face-to-face play',
        body: 'Set aside two short moments each day for face-to-face play. Try peekaboo, turn-taking, or simple songs. Aim for 10 minutes each time.',
      },
      {
        title: 'Name what matters',
        body: 'During meals or play, name objects, actions, and feelings out loud. Repetition helps connect words to everyday life.',
      },
      {
        title: 'Keep screens in the background off',
        body: 'Try keeping TVs and phones off during meals and playtime this week so attention stays on people, sounds, and interaction.',
      },
    ],
    cta: 'Talk to a paediatric specialist',
    link: 'Find a child development centre near me',
    empathy: 'You noticed early. That gives Avyan a strong start.',
    empathyTitleSentences: 1,
  },
  clear: {
    headline: 'Some clear patterns worth acting on gently.',
    meaning:
      'A few consistent patterns showed up across what you shared. This is not cause for panic. Acting early tends to make the most difference for the little ones.',
    actions: [
      {
        title: 'Cognitive play',
        body: 'Set aside two short daily moments for face-to-face play. Try peekaboo, turn-taking, or simple songs. Aim for 10 minutes each time.',
      },
      {
        title: 'Word association',
        body: 'Hold something he wants near your face and ask him to say “give me” or “mine.” Repeat 5 times a day. This links words to real wants.',
      },
      {
        title: 'Task association',
        body: 'Ask him to pick something up. Say it twice calmly. If he does not respond, gently guide his hand to the object while repeating the word slowly.',
      },
    ],
    cta: 'Talk to a paediatric specialist',
    link: 'Find a child development centre near me',
    empathy: 'You noticed. You acted. That is the most important thing you could have done for Avyan.',
    empathyTitleSentences: 2,
  },
  urgent: {
    headline: 'These patterns suggest getting support soon.',
    meaning:
      'A stronger pattern showed up across what you shared. This is not cause for panic, but it is a signal to seek support early. Early guidance can make the biggest difference right now.',
    extra: 'This is not a diagnosis. It is a starting point for timely action.',
    actions: [
      {
        title: 'Reduce screens gradually',
        body: 'Do not cut screens suddenly. Reduce screen time in small steps over the next few days so the change feels manageable for both of you.',
      },
      {
        title: 'Increase face-to-face moments',
        body: 'Add two short daily moments of face-to-face play, songs, or turn-taking. Even 10 minutes at a time can help.',
      },
      {
        title: 'Book expert support this week',
        body: 'Plan one conversation with a paediatric specialist or child development centre this week and carry these observations with you.',
      },
    ],
    cta: 'Talk to a paediatric specialist this week',
    link: 'Find a child development centre near me',
    empathy: 'You noticed early. Acting now is the right next step for Avyan.',
    empathyTitleSentences: 1,
  },
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function loadUiConfig() {
  const params = new URLSearchParams(window.location.search)
  const microParam = (params.get('micro') ?? '').toLowerCase()
  const microEnabled = !['0', 'false', 'off'].includes(microParam)

  return {
    microEnabled,
  }
}

function splitEmpathy(empathyText, titleSentenceCount = 2) {
  const parts = empathyText
    .split('. ')
    .map((part) => part.trim().replace(/\.$/, ''))
    .filter(Boolean)

  const titleParts = parts.slice(0, titleSentenceCount)
  const bodyParts = parts.slice(titleSentenceCount)

  return {
    title: titleParts.length ? `${titleParts.join('. ')}.` : '',
    body: bodyParts.length ? `${bodyParts.join('. ')}.` : '',
  }
}

function App() {
  const persisted = loadState()
  const uiConfig = loadUiConfig()
  const [screen, setScreen] = useState('splash')
  const [sectionIndex, setSectionIndex] = useState(persisted?.sectionIndex ?? 0)
  const [questionInSection, setQuestionInSection] = useState(persisted?.questionInSection ?? 0)
  const [answers, setAnswers] = useState(persisted?.answers ?? {})
  const [selected, setSelected] = useState(null)
  const [tapOption, setTapOption] = useState(null)
  const [questionMotion, setQuestionMotion] = useState('idle')
  const [loaderStep, setLoaderStep] = useState(0)
  const [loaderMoving, setLoaderMoving] = useState(false)
  const [loaderDone, setLoaderDone] = useState(false)
  const [manualResultTier, setManualResultTier] = useState(null)
  const [showStories, setShowStories] = useState(false)
  const [showDeepDive, setShowDeepDive] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setScreen('home'), 2100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const state = {
      sectionIndex,
      questionInSection,
      answers,
      screen,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [sectionIndex, questionInSection, answers, screen])

  useEffect(() => {
    if (screen !== 'loader') return undefined

    setLoaderStep(0)
    setLoaderMoving(false)
    setLoaderDone(false)

    const timers = []
    const schedule = (fn, delay) => {
      const timer = setTimeout(fn, delay)
      timers.push(timer)
    }

    const reachSecondMs = LOADER_HOLD_MS + LOADER_TRAVEL_MS
    const startSecondTravelMs = reachSecondMs + LOADER_HOLD_MS
    const reachThirdMs = startSecondTravelMs + LOADER_TRAVEL_MS
    const finishThirdMs = reachThirdMs + LOADER_FINAL_GAP_MS
    const showResultMs = finishThirdMs + LOADER_FINAL_GAP_MS

    schedule(() => setLoaderMoving(true), LOADER_HOLD_MS)
    schedule(() => {
      setLoaderStep(1)
      setLoaderMoving(false)
    }, reachSecondMs)

    schedule(() => setLoaderMoving(true), startSecondTravelMs)
    schedule(() => {
      setLoaderStep(2)
      setLoaderMoving(false)
    }, reachThirdMs)

    schedule(() => setLoaderDone(true), finishThirdMs)
    schedule(() => setScreen('result'), showResultMs)

    return () => timers.forEach(clearTimeout)
  }, [screen])

  const globalQuestionIndex = sectionIndex * 5 + questionInSection
  const currentQuestion = questions[globalQuestionIndex]
  const answeredCount = Object.keys(answers).length
  const answerKey = `q-${globalQuestionIndex}`
  const segmentFills = [0, 1, 2].map((idx) => {
    if (idx < sectionIndex) return 1
    if (idx === sectionIndex) return (questionInSection + 1) / 5
    return 0
  })

  useEffect(() => {
    if (!currentQuestion) return
    setSelected(answers[answerKey] ?? null)
  }, [globalQuestionIndex, answerKey, answers, currentQuestion])

  const totalScore = useMemo(() => {
    return Object.entries(answers).reduce((acc, [key, value]) => {
      const index = Number(key.replace('q-', ''))
      const q = questions[index]
      if (!q) return acc
      const map = scoring[q.optionType]
      return acc + (map[value] ?? 0)
    }, 0)
  }, [answers])

  const activeTier = manualResultTier ?? getResultKey(totalScore)
  const activeResult = resultCopy[activeTier]
  const activeLoaderState = loaderStates[loaderStep]
  const empathyCopy = splitEmpathy(activeResult.empathy, activeResult.empathyTitleSentences ?? 2)
  const microEnabled = uiConfig.microEnabled

  const resumeAvailable = answeredCount > 0 && screen === 'home' && answeredCount < 15

  function goHome() {
    setScreen('home')
    setShowStories(false)
    setShowDeepDive(false)
  }

  function startAssessment() {
    setScreen('sectionIntro')
  }

  function beginSection() {
    setQuestionMotion('idle')
    setScreen('question')
  }

  function onSelectAnswer(option) {
    if (microEnabled) {
      setTapOption(option)
      setTimeout(() => setTapOption(null), 180)
    }
    setSelected(option)
    setAnswers((prev) => ({ ...prev, [answerKey]: option }))
    setTimeout(() => {
      goNextAuto()
    }, 500)
  }

  function goNextAuto() {
    if (questionInSection < 4) {
      setQuestionMotion('next')
      setQuestionInSection((q) => q + 1)
      return
    }
    if (sectionIndex < 2) {
      setQuestionMotion('idle')
      setSectionIndex((s) => s + 1)
      setQuestionInSection(0)
      setScreen('sectionIntro')
      return
    }
    setLoaderStep(0)
    setScreen('loader')
  }

  function previousQuestion() {
    if (globalQuestionIndex === 0) return
    setQuestionMotion('prev')
    if (questionInSection > 0) {
      setQuestionInSection((q) => q - 1)
      return
    }
    setSectionIndex((s) => s - 1)
    setQuestionInSection(4)
  }

  useEffect(() => {
    if (!microEnabled) return undefined
    if (questionMotion === 'idle') return undefined
    const timer = setTimeout(() => setQuestionMotion('idle'), 260)
    return () => clearTimeout(timer)
  }, [globalQuestionIndex, questionMotion, microEnabled])

  function cancelOrSaveExit() {
    goHome()
  }

  function startOver() {
    setAnswers({})
    setSectionIndex(0)
    setQuestionInSection(0)
    setManualResultTier(null)
    setScreen('home')
    localStorage.removeItem(STORAGE_KEY)
  }

  function openScenario(tier) {
    setManualResultTier(tier)
    setScreen('result')
  }

  return (
    <div className={`app-shell ${microEnabled ? 'micro-on' : 'micro-off'}`}>
      <div className="phone-frame">
        {screen === 'splash' && (
          <section className="screen splash fade-in">
            <div className="brand-lockup">
              <img className="brand-logo" src={ASSETS.logo} alt="Babywise AI" />
            </div>
            <p>Your trusted child development companion</p>
          </section>
        )}

        {screen === 'home' && (
          <section className="screen home slide-in">
            <header className="home-top">
              <button className="ghost" aria-label="Menu">
                <img src={ASSETS.menu} alt="" />
              </button>
              <div className="welcome-wrap">
                <img className="parent-avatar" src={ASSETS.avatarMom} alt="Anuradha" />
                <div className="welcome">
                  <small>Welcome back,</small>
                  <strong>Anuradha</strong>
                </div>
              </div>
              <button className="icon-circle" aria-label="Notifications">
                <img src={ASSETS.bell} alt="" />
              </button>
            </header>

            <div className="child-row">
              <div className="child-chip active">
                <div className="child-head">
                  <img src={ASSETS.avatarBoy} alt="Avyan" />
                  <div className="child-text">
                    <strong>Avyan</strong>
                    <small>2.1 years old</small>
                  </div>
                </div>
              </div>
              <div className="child-chip">
                <div className="child-head">
                  <img src={ASSETS.avatarGirl} alt="Aanya" />
                  <div className="child-text">
                    <strong>Aanya</strong>
                    <small>4.6 years old</small>
                  </div>
                </div>
              </div>
              <button className="add-child" aria-label="Add child">
                <img src={ASSETS.add} alt="" />
              </button>
            </div>

            <p className="trust-pill">
              <img src={ASSETS.brain} alt="" />
              This is pattern mapping, not a diagnosis!
            </p>
            <h2>Check Avyan’s early development in 5 minutes.</h2>
            <p className="sub">
              Begin with a 15 question initial assessment about speech, connection, and play
            </p>

            <div className="trust-grid">
              <article>
                <img src={ASSETS.trust} alt="" />
                <strong>Basis IAP, WHO &amp; NIMHANS guidelines</strong>
              </article>
              <article>
                <img src={ASSETS.review} alt="" />
                <strong>Reviewed by paediatric specialists</strong>
              </article>
              <article>
                <img src={ASSETS.plan} alt="" />
                <strong>Personalised home plan after completion</strong>
              </article>
            </div>

            <button className="stories-link" onClick={() => setShowStories(true)}>
              <img src={ASSETS.stories} alt="" />
              <div>
                <span>See caregiver stories</span>
                <small>Real parent experiences.</small>
              </div>
              <em>›</em>
            </button>

            <button className="primary cta" onClick={startAssessment}>
              {resumeAvailable ? 'Continue Assessment' : 'Take Assessment'}
            </button>

            {resumeAvailable && (
              <button className="text-link" onClick={startOver}>
                Start over
              </button>
            )}

            <p className="powered">Powered by Babywise AI</p>
          </section>
        )}

        {screen === 'sectionIntro' && (
          <section className="screen section-intro slide-in">
            <button className="top-back" onClick={goHome}>
              <img src={ASSETS.arrow} alt="" />
              Back
            </button>

            <div className="intro-content">
              <p className="section-label">{sectionMeta[sectionIndex].title.toUpperCase()}</p>
              <h2>{sectionMeta[sectionIndex].heading}</h2>
              <p>There are no right or wrong answers. Just respond based on what you observe every day.</p>

              <div className="time-card">
                <img src={ASSETS.hourglass} alt="" />
                <strong>05 question</strong>
                <span>{sectionMeta[sectionIndex].minutes}</span>
              </div>
            </div>

            <button className="primary" onClick={beginSection}>
              Continue
            </button>
            <p className="footer-disclaimer">This is pattern mapping, not a diagnosis</p>
          </section>
        )}

        {screen === 'question' && currentQuestion && (
          <section
            className={`screen question slide-in ${
              microEnabled && questionMotion !== 'idle' ? `question-motion-${questionMotion}` : ''
            }`}
          >
            <div className="question-appbar">
              <header className="question-head">
                <button className="cancel" onClick={cancelOrSaveExit}>
                  <img
                    className={answeredCount === 0 ? 'icon-plus-close' : 'icon-save-exit'}
                    src={answeredCount === 0 ? ASSETS.add : ASSETS.cancel}
                    alt=""
                  />
                  <span className="cancel-label">{answeredCount === 0 ? 'Cancel' : 'Save & Exit'}</span>
                </button>
                <p>
                  Section {sectionIndex + 1} of 3: Question {questionInSection + 1} of 5
                </p>
              </header>

              <div className="progress-segments" role="presentation" aria-hidden="true">
                {segmentFills.map((fill, idx) => (
                  <div key={idx} className="segment">
                    <div className="segment-fill" style={{ width: `${fill * 100}%` }} />
                  </div>
                ))}
              </div>
            </div>

            <h2>{currentQuestion.text}</h2>

            <div className="options">
              {optionSets[currentQuestion.optionType].map((option) => (
                <button
                  key={option}
                  className={`option ${selected === option ? 'selected' : ''} ${
                    tapOption === option ? 'option-tap' : ''
                  }`}
                  onClick={() => onSelectAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <p className="footer-disclaimer question-disclaimer">This is pattern mapping, not a diagnosis</p>

            <div className="question-bottom">
              {globalQuestionIndex > 0 && (
                <button className="previous" onClick={previousQuestion}>
                  <img src={ASSETS.arrow} alt="" />
                  <span>Previous question</span>
                </button>
              )}
            </div>
          </section>
        )}

        {screen === 'loader' && (
          <section className="screen loader fade-in">
            <div className="loader-progress" aria-hidden="true">
              {[0, 1, 2].map((step) => (
                <div key={step} className="loader-progress-item">
                  <div
                    className={[
                      'loader-node',
                      step < loaderStep || loaderDone ? 'is-complete' : '',
                      step === loaderStep && !loaderDone ? 'is-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {step < loaderStep || loaderDone ? (
                      <img src={ASSETS.tick} alt="" />
                    ) : step === loaderStep && !loaderDone ? (
                      <img className="loader-node-spinner" src={ASSETS.loader} alt="" />
                    ) : null}
                  </div>
                  {step < 2 && (
                    <div className="loader-connector">
                      <div
                        className="loader-connector-fill"
                        style={{
                          width: `${step < loaderStep || (step === loaderStep && loaderMoving) ? 100 : 0}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <h2 key={`loader-title-${loaderStep}`} className={microEnabled ? 'loader-copy-enter' : ''}>
              {activeLoaderState.title}
            </h2>

            <p key={`loader-body-${loaderStep}`} className={microEnabled ? 'loader-copy-enter' : ''}>
              {activeLoaderState.body}
            </p>
            <p className="footer-disclaimer">This is pattern mapping, not a diagnosis</p>
          </section>
        )}

        {screen === 'result' && (
          <section className="screen result slide-in">
            <div className="brand-lockup small">
              <img className="brand-logo" src={ASSETS.logo} alt="Babywise AI" />
            </div>

            <article className={`report-card ${microEnabled ? 'reveal r1' : ''}`}>
              <small className="report-chip">
                <img src={ASSETS.report} alt="" />
                Avyan’s initial assessment report
              </small>
              <h2>{activeResult.headline}</h2>
              <strong>What this means:</strong>
              <p>{activeResult.meaning}</p>
              {activeResult.extra && <p>{activeResult.extra}</p>}
            </article>

            <p className={`center-note ${microEnabled ? 'reveal r2' : ''}`}>This is pattern mapping, not a diagnosis</p>

            {activeTier !== 'allGood' && (
              <>
                <h3 className={microEnabled ? 'reveal r3' : ''}>3 things to try this week</h3>
                <div className={`action-list ${microEnabled ? 'reveal r4' : ''}`}>
                  {activeResult.actions.map((item, idx) => (
                    <article key={item.title} className={`action-card ${microEnabled ? `reveal r${5 + idx}` : ''}`}>
                      <strong>
                        <img src={actionNumberIcons[idx] ?? ASSETS.one} alt="" />
                        <span>{item.title}</span>
                      </strong>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>

                <div className={`result-actions ${microEnabled ? 'reveal r8' : ''}`}>
                  <button className={`secondary ${microEnabled ? 'cta-breathe' : ''}`}>
                    <img src={ASSETS.doctor} alt="" />
                    {activeResult.cta}
                  </button>
                  <button className="inline-link">
                    <img src={ASSETS.location} alt="" />
                    {activeResult.link}
                  </button>
                </div>
              </>
            )}

            <article className="pro-card" onClick={() => setShowDeepDive(true)}>
              <div>
                <h4>Try our deep assessment</h4>
                <p>
                  The deep assessment explores patterns in greater detail and includes a structured
                  3-month home support plan.
                </p>
              </div>
              <span>PRO</span>
            </article>

            <div className="empathy">
              <img src={ASSETS.heart} alt="" />
              <h3>{empathyCopy.title}</h3>
              <p>{empathyCopy.body}</p>
            </div>

            <button className="text-link" onClick={goHome}>
              Back to home
            </button>
          </section>
        )}

        {(showStories || showDeepDive) && (
          <div className="modal-backdrop" onClick={() => (showStories ? setShowStories(false) : setShowDeepDive(false))}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              {showStories && (
                <>
                  <h3>Caregiver stories</h3>
                  <p className="meta">Real parent experiences. Individual outcomes vary.</p>
                  {stories.map((story) => (
                    <p key={story} className="story">
                      {story}
                    </p>
                  ))}
                  <button className="secondary" onClick={() => setShowStories(false)}>
                    Close
                  </button>
                </>
              )}

              {showDeepDive && (
                <>
                  <h3>Deep Assessment</h3>
                  <p className="meta">
                    A more detailed behaviour review with nested questions, a structured 3-month
                    support plan, and clearer progress tracking.
                  </p>
                  <button className="primary">Explore Pro assessment</button>
                  <button className="text-link" onClick={() => setShowDeepDive(false)}>
                    Maybe later
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
