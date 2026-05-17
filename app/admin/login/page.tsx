'use client';

import { FormEvent, useCallback, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ADMIN_EMAIL, isAdminEmail, normalizeAdminEmail } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ValidatedField, invalidFieldClass } from '@/components/validated-field';
import { validateEmail, validatePassword, trimValue } from '@/lib/validation';

const INPUT_CLASS =
  'h-11 border-[#FAC1B5]/40 focus-visible:border-[#F283AE] focus-visible:ring-[#F283AE]/30';

type LoginFields = 'email' | 'password';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<LoginFields, boolean>>>({});
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<LoginFields, string>>>({});

  const urlError = searchParams.get('error');
  const displayError =
    error ??
    (urlError === 'unauthorized'
      ? 'This account is not authorized for admin access.'
      : null);

  const validators = useMemo(
    () => ({
      email: () => validateEmail(email, true),
      password: () => validatePassword(password),
    }),
    [email, password]
  );

  const blurValidate = useCallback(
    (field: LoginFields) => {
      setTouched((t) => ({ ...t, [field]: true }));
      setFieldErrors((e) => ({ ...e, [field]: validators[field]() }));
    },
    [validators]
  );

  const validateAll = useCallback(() => {
    const next: Partial<Record<LoginFields, string>> = {
      email: validators.email(),
      password: validators.password(),
    };
    setFieldErrors(next);
    setTouched({ email: true, password: true });
    return !next.email && !next.password;
  }, [validators]);

  const formIsValid = useMemo(
    () => !validators.email() && !validators.password(),
    [validators]
  );

  const fieldInvalid = (field: LoginFields) => Boolean(touched[field] && fieldErrors[field]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validateAll()) return;

    setLoading(true);

    const supabase = createClient();
    const normalizedEmail = normalizeAdminEmail(trimValue(email));

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError) {
      const msg = signInError.message.toLowerCase();
      if (msg.includes('email not confirmed')) {
        setError(
          'Admin email is not confirmed yet. Run supabase-admin-auth.sql in your Supabase SQL Editor.'
        );
      } else if (msg.includes('invalid login credentials')) {
        setError(`Invalid password, or email must be exactly ${ADMIN_EMAIL}.`);
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    if (!isAdminEmail(data.user?.email)) {
      await supabase.auth.signOut();
      setError('This account is not authorized for admin access.');
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F0E8DF]/40 flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#FAC1B5]/30 overflow-hidden">
        <div className="bg-[#2C2C2C] px-8 py-10 text-center text-white">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F283AE]/20">
            <Lock className="h-7 w-7 text-[#F283AE]" />
          </div>
          <h1 className="text-2xl font-serif">Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-8 py-8 space-y-6">
          {displayError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {displayError}
            </div>
          )}

          <ValidatedField label="Email" htmlFor="email" required error={fieldErrors.email} touched={touched.email}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => blurValidate('email')}
              placeholder="Enter your email"
              aria-invalid={fieldInvalid('email')}
              className={invalidFieldClass(fieldInvalid('email'), INPUT_CLASS)}
            />
          </ValidatedField>

          <ValidatedField label="Password" htmlFor="password" required error={fieldErrors.password} touched={touched.password}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => blurValidate('password')}
              placeholder="Enter your password"
              aria-invalid={fieldInvalid('password')}
              className={invalidFieldClass(fieldInvalid('password'), INPUT_CLASS)}
            />
          </ValidatedField>

          <Button
            type="submit"
            disabled={loading || !formIsValid}
            className="w-full h-11 bg-[#F283AE] hover:bg-[#e06f9c] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F0E8DF]/40 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#F283AE]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
