'use client';

import { cn } from '@/lib/utils';
import { useState, useRef, useTransition, useEffect } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AdminToggleUrl from './component.toggle-url';
import type { Url } from '@prisma/client';
import { updateUrl } from '@/lib/actions/urlActions';
import { useRouter } from 'next/navigation';
import { Pencil, BarChart, Check, X } from 'lucide-react';
import { useMediaQuery } from '@/lib/hooks/use-media-query';

interface AdminUrlRowProps {
  url: Url;
  visits: number;
}

export default function AdminUrlRow({ url, visits }: AdminUrlRowProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    slug: url.slug,
    target: url.target,
  });
  const [isPending, startTransition] = useTransition();

  const slugRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);

  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    if (isEditing && targetRef.current) {
      targetRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const hasChanges = () => {
      return formState.slug !== url.slug || formState.target !== url.target;
    };

    if (!hasChanges()) {
      toast.message('No changes to save.');
      return;
    }

    if (!formState.slug || !formState.target) {
      toast.error('Both fields are required.');
      return;
    }

    try {
      new URL(formState.target);
    } catch {
      toast.error('Please enter a valid URL.');
      return;
    }

    const formData = new FormData();
    formData.append('id', String(url.id));
    formData.append('slug', formState.slug);
    formData.append('target', formState.target);

    await updateUrl(formData);

    startTransition(() => {
      router.refresh();
    });
    toast.success(`Updated ${formState.slug}`);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormState({ slug: url.slug, target: url.target });
    setIsEditing(false);
  };

  if (isMobile) {
    return (
      <div className={cn('border-b', isEditing && 'bg-muted', 'px-4 py-2')}>
        <div className={cn('flex gap-2', isEditing ? 'flex-col' : 'flex-row')}>
          <div>
            <label className="text-sm font-semibold">
              {isEditing ? 'Slug' : url.slug}
            </label>
            {isEditing ? (
              <Input
                ref={slugRef}
                type="text"
                value={formState.slug}
                onChange={e =>
                  setFormState(prev => ({ ...prev, slug: e.target.value }))
                }
                className="mt-1"
              />
            ) : null}
          </div>
          {!isEditing ? <div>→</div> : null}
          <div>
            <label className="text-sm font-semibold">
              {isEditing ? 'Target' : url.target}
            </label>
            {isEditing ? (
              <Input
                ref={targetRef}
                type="text"
                value={formState.target}
                onFocus={() => {
                  if (!formState.target) {
                    setFormState(prev => ({ ...prev, target: 'https://' }));
                  }
                }}
                onChange={e =>
                  setFormState(prev => ({ ...prev, target: e.target.value }))
                }
                className="mt-1"
              />
            ) : null}
          </div>
        </div>
        <div className="flex justify-between gap-2 mt-2">
          <div>
            {!isEditing ? (
              <>
                <label className="text-sm font-semibold mr-2">Visits</label>
                <span>
                  {0} / {visits}
                </span>
              </>
            ) : null}
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isPending} size="icon">
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isPending}
                  size="icon"
                  variant="outline"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <AdminToggleUrl slug={url.slug} enabled={url.enabled} />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Link href={`/-/admin/metrics/${url.slug}`}>
                  <Button size="icon" variant="outline">
                    <BarChart className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={cn('table-row', isEditing && 'bg-muted')}>
      <div className="table-cell px-2 py-2 align-middle">
        {isEditing ? (
          <Input
            ref={slugRef}
            type="text"
            value={formState.slug}
            onChange={e =>
              setFormState(prev => ({ ...prev, slug: e.target.value }))
            }
            onKeyDown={e => {
              if (e.key === 'Escape') {
                handleCancel();
              } else if (e.key === 'Enter') {
                if (!formState.target && targetRef.current) {
                  targetRef.current.focus();
                } else {
                  handleSave();
                }
              }
            }}
            className="border px-2 py-1 rounded w-24"
          />
        ) : (
          <span className="flex h-9 items-center px-2 py-1 text-base md:text-sm border border-transparent rounded w-24">
            {url.slug}
          </span>
        )}
      </div>
      <div className="table-cell px-2 py-2 align-middle">→</div>
      <div className="table-cell px-2 py-2 align-middle">
        {isEditing ? (
          <Input
            ref={targetRef}
            type="text"
            value={formState.target}
            onFocus={() => {
              if (!formState.target) {
                setFormState(prev => ({ ...prev, target: 'https://' }));
              }
            }}
            onChange={e =>
              setFormState(prev => ({ ...prev, target: e.target.value }))
            }
            onKeyDown={e => {
              if (e.key === 'Escape') {
                handleCancel();
              } else if (e.key === 'Enter') {
                if (!formState.slug && slugRef.current) {
                  slugRef.current.focus();
                } else {
                  handleSave();
                }
              }
            }}
            className="border px-2 py-1 rounded w-full"
          />
        ) : (
          <span className="flex h-9 items-center px-2 py-1 text-base md:text-sm border border-transparent rounded">
            {url.target}
          </span>
        )}
      </div>
      <div className="table-cell px-2 py-2 align-middle">
        <span className="flex h-9 items-center px-2 py-1 text-base md:text-sm border border-transparent rounded">
          {0} / {visits}
        </span>
      </div>
      <div className="table-cell px-2 py-2 align-middle">
        <div className="flex flex-row gap-2 justify-end">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={isPending}
                size="icon"
                variant="default"
                aria-label="Save changes"
              >
                <span className={isPending ? 'animate-pulse' : ''}>
                  <Check className="h-4 w-4" />
                </span>
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isPending}
                size="icon"
                variant="outline"
                aria-label="Cancel edit"
              >
                <span className={isPending ? 'animate-pulse' : ''}>
                  <X className="h-4 w-4" />
                </span>
              </Button>
            </>
          ) : (
            <>
              <AdminToggleUrl slug={url.slug} enabled={url.enabled} />
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsEditing(true)}
                aria-label="Edit URL"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Link href={`/-/admin/metrics/${url.slug}`}>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="View metrics for URL"
                  title="Metrics"
                >
                  <BarChart className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
