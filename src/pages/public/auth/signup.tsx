/**
 * Resources & configs
 */
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'

import { useTranslation } from 'react-i18next'

/**
 * Components
 */
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

/**
 * Form schema definition
 */
const createFormSchema = (tAuth: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, { message: tAuth('signup.tk_firstNameError_') }),
    lastName: z.string().min(1, { message: tAuth('signup.tk_lastNameError_') }),
    email: z.string().email({ message: tAuth('signup.tk_emailError_') }),
    password: z.string().min(8, { message: tAuth('signup.tk_passwordError_') })
  })

type FormSchemaType = z.infer<ReturnType<typeof createFormSchema>>

/**
 * React declaration
 */
export function SignUp() {
  const { t: tAuth } = useTranslation('auth')
  const { t: tCommon } = useTranslation('common')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  // Create form with schema
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(createFormSchema(tAuth)),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: FormSchemaType) => {
    setIsLoading(true)
    setUserEmail(values.email)

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      setIsRegistered(true)
    }, 1000)
  }

  // Reusable form field component
  const renderFormField = (name: keyof FormSchemaType, label: string, placeholder?: string, type?: string, autoComplete?: string, description?: string) => (
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

  // Registration success view
  if (isRegistered) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mb-4 flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center text-2xl">{tAuth('signup.tk_successTitle_') || 'Inscription réussie !'}</CardTitle>
            <CardDescription className="text-center">{tAuth('signup.tk_successDescription_') || 'Votre compte a été créé avec succès.'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 text-blue-800">
              <AlertDescription>{tAuth('signup.tk_verifyEmailDescription_', { userEmail })}</AlertDescription>
            </Alert>
            <p className="text-center text-sm text-muted-foreground">{tAuth('signup.tk_checkSpam_')}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              {tAuth('signin.tk_signin_')}
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{tAuth('signup.tk_title_')}</h2>
          <p className="mt-2 text-sm text-gray-600">{tAuth('signup.tk_description_')}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {renderFormField('firstName', tCommon('user.tk_firstName_'), tCommon('user.tk_firstNamePlaceholder_'))}
              {renderFormField('lastName', tCommon('user.tk_lastName_'), tCommon('user.tk_lastNamePlaceholder_'))}
            </div>

            {renderFormField('email', tCommon('user.tk_email_'), tCommon('user.tk_emailPlaceholder_'), 'email', 'email')}
            {renderFormField('password', tAuth('signup.tk_password_'), undefined, 'password', 'new-password', tAuth('signup.tk_passwordDescription_'))}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? tCommon('loading.tk_loadingCreate_') : tAuth('signup.tk_signup_')}
            </Button>

            <div className="flex items-center justify-center">
              <Separator className="w-1/3" />
              <span className="mx-4 text-sm text-gray-500">{tCommon('other.tk_or_')}</span>
              <Separator className="w-1/3" />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {tAuth('signup.tk_alreadyAccount_')}{' '}
                <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                  {tAuth('signin.tk_signin_')}
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
