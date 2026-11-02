'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, Check, Loader2, Mail } from 'lucide-react'

type SignupSource = 'order-confirmation' | 'footer'

interface NewsletterSignupProps {
  defaultEmail?: string
  orderReference?: string
  source?: SignupSource
  defaultSubscribed?: boolean
  className?: string
}

export default function NewsletterSignup({
  defaultEmail = '',
  orderReference,
  source = 'order-confirmation',
  defaultSubscribed = false,
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState(defaultEmail)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    defaultSubscribed ? 'success' : 'idle'
  )
  const [message, setMessage] = useState(defaultSubscribed ? "You're on the list." : '')
  const [website, setWebsite] = useState('')
  const prefilled = useRef(false)

  useEffect(() => {
    if (!prefilled.current && defaultEmail) {
      setEmail(defaultEmail)
      prefilled.current = true
    }
  }, [defaultEmail])

  useEffect(() => {
    if (defaultSubscribed) {
      setStatus('success')
      setMessage("You're on the list.")
    }
  }, [defaultSubscribed])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          orderReference,
          consent: true,
          website,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(
          data?.error || 'We could not save your email right now. Please try again.'
        )
      }

      setStatus('success')
      setMessage(data?.message || "You're on the list.")
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'We could not save your email right now. Please try again.'
      )
    }
  }

  const isSuccess = status === 'success'

  return (
    <section
      className={`border border-gold/25 bg-chrome p-6 text-left sm:p-8 ${className}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="mb-3 flex items-center gap-2 text-gold-ink">
            <Mail size={15} strokeWidth={1.8} />
            <span className="text-[10px] font-medium uppercase tracking-[0.22em]">
              The AMAPELS List
            </span>
          </div>
          <h3 className="font-serif text-xl text-ink sm:text-2xl">
            First access, quietly delivered.
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            New pieces and private price drops, straight to your inbox. No noise — just the
            good stuff.
          </p>
        </div>

        {isSuccess ? (
          <div className="flex items-start gap-3 lg:max-w-xs">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-ink">
              <Check size={16} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">{message || "You're on the list."}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink/60">
                We&apos;ll let you know when something new lands.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full lg:max-w-md">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="min-w-0 flex-1 border border-ink/45 bg-paper px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink/45 focus:border-ink focus:ring-2 focus:ring-gold-ink/30"
                style={{ fontSize: '16px' }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 bg-ink px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-on-ink transition-colors hover:bg-gold hover:text-black-dark disabled:cursor-not-allowed disabled:opacity-60 sm:text-[11px]"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Joining
                  </>
                ) : (
                  <>
                    Keep me posted
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              name="website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
          </form>
        )}
      </div>

      {status === 'error' && message && (
        <p className="mt-4 text-xs text-danger" role="alert">
          {message}
        </p>
      )}

      {!isSuccess && (
        <p className="mt-4 text-[11px] leading-relaxed text-ink/50">
          By subscribing you agree to receive new arrivals and price drop emails. Unsubscribe
          anytime.
        </p>
      )}
    </section>
  )
}
