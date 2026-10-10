import { Component, type ErrorInfo, type ReactNode } from 'react'
import { copy } from '../data/copy'
import { config } from '../data/config'
import { Potato } from './doodles'

interface Props {
  children: ReactNode
  /** Render nothing instead of the message (used for tiny global bits like the cursor). */
  silent?: boolean
}

interface State {
  failed: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('section failed:', error.message, info.componentStack)
  }

  render(): ReactNode {
    if (!this.state.failed) return this.props.children
    if (this.props.silent) return null
    return (
      <div role="alert" className="mx-auto my-12 flex max-w-md flex-col items-center gap-4 px-6 text-center">
        <Potato className="w-24 rotate-[-8deg]" />
        <p className="font-hand text-[1.7rem] leading-tight">{copy.errorBoundary}</p>
        <button type="button" className="btn-sticker" onClick={() => window.location.reload()}>
          {config.ui.refresh}
        </button>
      </div>
    )
  }
}
