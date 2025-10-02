'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleUrl } from '@/lib/actions/urlActions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminToggleUrl({
  slug,
  enabled,
  children,
}: {
  slug: string;
  enabled: boolean;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleToggle() {
    const formData = new FormData();
    formData.append('slug', slug);
    formData.append('enabled', String(!enabled));

    try {
      await toggleUrl(formData);

      startTransition(() => {
        router.refresh(); // refresh server data
      });

      toast.success(`${enabled ? 'Disabled' : 'Enabled'} ${slug}`);
    } catch (err) {
      console.error('Error toggling URL:', err);
      toast.error(`Failed to toggle ${slug}`);
    }
  }

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending}
      size="icon"
      variant="outline"
      aria-label={enabled ? 'Disable URL' : 'Enable URL'}
      aria-pressed={enabled}
    >
      {children ? (
        <span className={isPending ? 'animate-pulse' : ''}>{children}</span>
      ) : isPending ? (
        <Eye className="h-4 w-4 animate-pulse" />
      ) : enabled ? (
        <Eye className="h-4 w-4" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
    </Button>
  );
}
