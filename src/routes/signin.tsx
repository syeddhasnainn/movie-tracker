import { createFileRoute } from '@tanstack/react-router'
import { useAuthActions } from '@convex-dev/auth/react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  const { signIn } = useAuthActions()
  const navigate = useNavigate()

  const [step, setStep] = useState<'signUp' | 'signIn'>('signIn')

  return (
    <form
      className="flex flex-col gap-2 w-full max-w-sm min-h-screen mx-auto items-center justify-center absolute inset-0"
      onSubmit={async (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        try {
          await signIn('password', formData)

          navigate({ to: '/' })
        } catch {
          toast.error(
            "Incorrect email or password. If you don't have an account, please sign up first.",
          )
        }
      }}
    >
      <h1 className="text-2xl font-bold unbounded">Create an account </h1>
      <p className="text-sm text-muted-foreground text-center pb-4">
        Sign in to your account to continue
      </p>
      <Input name="email" placeholder="Email" type="text" />
      <Input name="password" placeholder="Password" type="password" />
      <Input name="flow" type="hidden" value={step} />
      <Button className="w-full" type="submit">
        {step === 'signIn' ? 'Sign in' : 'Sign up'}
      </Button>
      <div className="text-center text-muted-foreground text-xs">OR</div>
      <Button
        className="w-full"
        type="button"
        onClick={() => {
          setStep(step === 'signIn' ? 'signUp' : 'signIn')
        }}
      >
        {step === 'signIn' ? 'Sign up instead' : 'Sign in instead'}
      </Button>
    </form>
  )
}
