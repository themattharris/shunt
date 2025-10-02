import { LoginForm } from '@/components/login-form';
import SiteLogo from '@/components/site-logo';

export const metadata = {
  title: 'Login | Shunt',
  description: 'Login to your account',
};

export default function Page() {
  return (
    <>
      <SiteLogo />
      <div className="w-full max-w-sm mx-auto">
        <LoginForm />
      </div>
    </>
  );
}
