/**
 * Resources & configs
 */
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { z } from 'zod'

/**
 * Components
 */
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle } from 'lucide-react'

/**
 * Form schema definition
 */
const createFormSchema = (tAuth: (key: string) => string) =>
  z
    .object({
      password: z.string().min(6, { message: tAuth('fields.tk_passwordMinLength_') }),
      confirmPassword: z.string().min(1, { message: tAuth('fields.tk_confirmPasswordError_') })
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tAuth('fields.tk_passwordsDoNotMatchError_'),
      path: ['confirmPassword']
    })

type FormSchemaType = z.infer<ReturnType<typeof createFormSchema>>

/**
 * React declaration
 */
export function ResetPassword() {
  const location = useLocation()
  const { t: tAuth } = useTranslation('auth')
  const { t: tCommon } = useTranslation('common')
  const [isLoading, setIsLoading] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [isPasswordReset, setIsPasswordReset] = useState(false)

  // Extract reset token from URL if present
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get('resetPasswordToken')

    if (token) {
      // Validate token (in a real app, you would verify the token with your API)
      if (token.length < 20) {
        setTokenError(tAuth('resetPassword.tk_invalidTokenError_'))
      }
      // Note: In a real implementation, we would store the token to use it in the API call
    } else {
      setTokenError(tAuth('resetPassword.tk_missingTokenError_'))
    }
  }, [location.search, tAuth])

  // Create form with schema
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(createFormSchema(tAuth)),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = () => {
    setIsLoading(true)

    // Simulate API request with token
    setTimeout(() => {
      // In a real app, you would send the token from URL and new password to your API
      // const token = new URLSearchParams(location.search).get('resetPasswordToken')
      // api.resetPassword(token, values.password)

      setIsPasswordReset(true)
      setIsLoading(false)
    }, 1000)
  }

  // Reusable form field component with destructured arguments
  const renderFormField = ({
    name,
    label,
    placeholder = '',
    type = 'text',
    autoComplete = '',
    description = ''
  }: {
    name: keyof FormSchemaType
    label: string
    placeholder?: string
    type?: string
    autoComplete?: string
    description?: string
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} autoComplete={autoComplete} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )

  // Success view after password reset
  if (isPasswordReset) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">{tAuth('resetPassword.tk_successTitle_')}</CardTitle>
            <CardDescription className="text-center">{tAuth('resetPassword.tk_successDescription_')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 text-blue-800">
              <AlertDescription>{tAuth('resetPassword.tk_verifyPasswordUpdatedDescription_')}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              {tAuth('callToAction.tk_backToSignin_')}
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{tAuth('resetPassword.tk_title_')}</h2>
          <p className="mt-2 text-sm text-gray-600">{tAuth('resetPassword.tk_description_')}</p>
        </div>

        {tokenError ? (
          <Alert className="mt-6 bg-red-50 text-red-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>{tokenError}</AlertDescription>
            </div>
            <div className="mt-4 text-center">
              <Link to="/reset-password-request" className="font-medium text-blue-600 hover:text-blue-500">
                {tAuth('callToAction.tk_askForNewLink_')}
              </Link>
            </div>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
              {renderFormField({
                name: 'password',
                label: tAuth('fields.tk_newPassword_'),
                type: 'password',
                autoComplete: 'new-password',
                description: tAuth('fields.tk_passwordDescription_')
              })}

              {renderFormField({
                name: 'confirmPassword',
                label: tAuth('fields.tk_confirmPassword_'),
                type: 'password',
                autoComplete: 'new-password'
              })}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? tCommon('loading.tk_loadingUpdate_') : tAuth('callToAction.tk_updatePassword_')}
              </Button>

              <div className="text-center">
                <Link to="/signin" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  {tAuth('callToAction.tk_backToSignin_')}
                </Link>
              </div>
            </form>
          </Form>
        )}
      </Card>
    </div>
  )
}
