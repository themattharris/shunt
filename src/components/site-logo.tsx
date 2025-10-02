import Image from 'next/image';
import { getDomain } from '@/lib/server-utils';
import { cn } from '@/lib/utils';

export default async function SiteLogo({ className }: { className?: string }) {
  const domain = await getDomain();

  if (!domain) return <div>Domain not found</div>;

  return (
    <div className={cn('flex items-center w-4/12 mx-auto mt-10', className)}>
      <Image
        className="transition-all duration-300 dark:invert"
        src={`/-/${domain.host}/logo-title.png`}
        alt={domain.title}
        width={944}
        height={222}
      />
    </div>
  );
}
