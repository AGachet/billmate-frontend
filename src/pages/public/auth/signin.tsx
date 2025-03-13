/**
 * Resources & configs
 */
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { auth } from '@/lib/auth'

/**
 * Components
 */
import { Alert, AlertDescription } from '@/components/ui/shadcn/alert'
import { Button } from '@/components/ui/shadcn/button'
import { Card } from '@/components/ui/shadcn/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/shadcn/form'
import { Input } from '@/components/ui/shadcn/input'
import { Separator } from '@/components/ui/shadcn/separator'
import { AlertCircle } from 'lucide-react'

/**
 * Form schema definition
 */
const createFormSchema = (tAuth: (key: string) => string) =>
  z.object({
    email: z.string().email({ message: tAuth('fields.tk_emailError_') }),
    password: z.string().min(1, { message: tAuth('fields.tk_passwordError_') })
  })

type FormSchemaType = z.infer<ReturnType<typeof createFormSchema>>

/**
 * React declaration
 */
export function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t: tAuth } = useTranslation('auth')
  const { t: tCommon } = useTranslation('common')
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [confirmAccountToken, setConfirmAccountToken] = useState<string | null>(null)

  // Extract confirmAccountToken from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('confirmAccountToken')

    if (token) {
      setConfirmAccountToken(token)

      // Remove the token from URL to prevent reconfirmation on refresh
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [location.search])

  // Create form with schema
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(createFormSchema(tAuth)),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: FormSchemaType) => {
    setIsLoading(true)
    setAuthError(null)

    // Simulate authentication with or without token
    setTimeout(() => {
      try {
        // Simulate authentication logic
        const isValidCredentials = values.email.includes('@') && values.password.length >= 6

        if (!isValidCredentials) throw new Error('invalid_credentials')

        // If we have a token, we would send it along with the credentials
        if (confirmAccountToken) {
          console.log('Confirming account with token:', confirmAccountToken)
          // In a real app, you would send this token to your API
          // api.confirmAccount(values.email, values.password, confirmAccountToken)
        }

        // If everything is successful
        auth.setToken('fake-token')
        navigate('/dashboard')
      } catch {
        // Generic error message for any authentication issue
        setAuthError(tAuth('signin.tk_authError_'))
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  // Reusable form field
  const renderFormField = ({
    name,
    label,
    placeholder = '',
    type = 'text',
    autoComplete = ''
  }: {
    name: keyof FormSchemaType
    label: string
    placeholder?: string
    type?: string
    autoComplete?: string
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {name === 'password' ? (
            <div className="flex items-center justify-between">
              <FormLabel>{label}</FormLabel>
              <Link to="/reset-password-request" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                {tAuth('callToAction.tk_forgotPassword_')}
              </Link>
            </div>
          ) : (
            <FormLabel>{label}</FormLabel>
          )}
          <FormControl>
            <Input placeholder={placeholder} type={type} autoComplete={autoComplete} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{tAuth('signin.tk_title_')}</h2>
          <p className="mt-2 text-sm text-gray-600">{tAuth('signin.tk_description_')}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {authError && (
              <Alert className="bg-red-50 text-red-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription>{authError}</AlertDescription>
                </div>
              </Alert>
            )}

            {renderFormField({
              name: 'email',
              label: tCommon('user.tk_email_'),
              placeholder: tCommon('user.tk_emailPlaceholder_'),
              type: 'email',
              autoComplete: 'email'
            })}
            {renderFormField({
              name: 'password',
              label: tAuth('fields.tk_password_'),
              type: 'password',
              autoComplete: 'current-password'
            })}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? tCommon('loading.tk_loadingSignin_') : tAuth('callToAction.tk_signin_')}
            </Button>

            <div className="flex items-center justify-center">
              <Separator className="w-1/3" />
              <span className="mx-4 text-sm text-gray-500">{tCommon('other.tk_or_')}</span>
              <Separator className="w-1/3" />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {tAuth('signin.tk_noAccount_')}{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  {tAuth('callToAction.tk_signup_')}
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}
