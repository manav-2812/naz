import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import BilliCompanion from './components/BilliCompanion'
import BirthdayCake from './components/BirthdayCake'
import Countdown from './components/Countdown'
import Cursor from './components/Cursor'
import EasterEggs from './components/EasterEggs'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/Footer'
import Gate from './components/Gate'
import GiftBox from './components/GiftBox'
import Hero from './components/Hero'
import LastLineGoodbye from './components/LastLineGoodbye'
import Letter from './components/Letter'
import Loader from './components/Loader'
import LoveCoupons from './components/LoveCoupons'
import LoveJar from './components/LoveJar'
import MusicPlayer from './components/MusicPlayer'
import Notes from './components/Notes'
import Scrapbook from './components/Scrapbook'
import ScrollRibbon from './components/ScrollRibbon'
import Sparkles from './components/Sparkles'
import ThemeToggle from './components/ThemeToggle'
import Timeline from './components/Timeline'
import Toaster from './components/Toaster'
import { WavyDivider } from './components/doodles'
import { MusicProvider } from './hooks/useMusic'
import { getBirthdayInfo } from './lib/birthday'
import { lockScroll, useLenis } from './hooks/useLenis'

const MilkcakeGame = lazy(() => import('./components/MilkcakeGame'))
const LoveHeart = lazy(() => import('./components/LoveHeart'))

/** Mounts children only once the placeholder is near the viewport, so chunks load on approach. */
function NearView({ children, minHeight }: { children: ReactNode; minHeight: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '700px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ minHeight: near ? undefined : minHeight }}>
      {near ? children : null}
    </div>
  )
}

function Safe({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

function Divider() {
  return <WavyDivider className="mx-auto block h-8 w-[min(92%,1100px)]" />
}

export default function App() {
  const [opened, setOpened] = useState(false)
  useLenis()

  useEffect(() => {
    const bInfo = getBirthdayInfo()
    document.title = `happy ${bInfo.targetAgeOrdinal} birthday, naz 🎂`
  }, [])

  useEffect(() => {
    lockScroll(!opened)
  }, [opened])

  return (
    <MusicProvider>
      <ErrorBoundary silent>
        <Cursor />
      </ErrorBoundary>
      <ErrorBoundary silent>
        <Sparkles />
      </ErrorBoundary>
      <ErrorBoundary silent>
        <EasterEggs />
      </ErrorBoundary>
      <ErrorBoundary silent>
        <Toaster />
      </ErrorBoundary>

      {opened && (
        <>
          <ErrorBoundary silent>
            <ThemeToggle />
          </ErrorBoundary>
          <ErrorBoundary silent>
            <ScrollRibbon />
          </ErrorBoundary>
          <ErrorBoundary silent>
            <BilliCompanion />
          </ErrorBoundary>
        </>
      )}

      <main>
        <Safe>
          <Hero ready={opened} />
        </Safe>
        <Safe>
          <Countdown />
        </Safe>
        <Safe>
          <BirthdayCake />
        </Safe>
        <Divider />
        <Safe>
          <Timeline />
        </Safe>
        <Divider />
        <Safe>
          <Notes />
        </Safe>
        <Divider />
        <Safe>
          <Scrapbook />
        </Safe>
        <Divider />
        <Safe>
          <LoveCoupons />
        </Safe>
        <Divider />
        <Safe>
          <Letter />
        </Safe>
        <Divider />
        <Safe>
          <LoveJar />
        </Safe>
        <Divider />
        <Safe>
          <NearView minHeight="90dvh">
            <LoveHeart />
          </NearView>
        </Safe>
        <Divider />
        <Safe>
          <NearView minHeight="90dvh">
            <MilkcakeGame />
          </NearView>
        </Safe>
        <Safe>
          <GiftBox />
        </Safe>
      </main>
      <Safe>
        <Footer />
      </Safe>
      <Safe>
        <LastLineGoodbye />
      </Safe>

      <ErrorBoundary silent>
        <MusicPlayer />
      </ErrorBoundary>

      {!opened && (
        <ErrorBoundary>
          <Gate onOpened={() => setOpened(true)} />
        </ErrorBoundary>
      )}
    </MusicProvider>
  )
}
