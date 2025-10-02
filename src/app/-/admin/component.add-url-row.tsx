'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { addUrl } from '@/lib/actions/urlActions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useMediaQuery } from '@/lib/hooks/use-media-query';

export default function AdminAddUrlRow() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState({ slug: '', target: '' });
  const slugRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  const handleSave = async () => {
    if (!formState.slug || !formState.target) {
      toast.error('Both fields are required.');
      if (!formState.slug && slugRef.current) {
        slugRef.current.focus();
      } else if (!formState.target && targetRef.current) {
        targetRef.current.focus();
      }
      return;
    }

    try {
      new URL(formState.target);
    } catch {
      toast.error('Please enter a valid URL.');
      return;
    }

    const formData = new FormData();
    formData.append('slug', formState.slug);
    formData.append('target', formState.target);

    await addUrl(formData);

    startTransition(() => {
      router.refresh();
    });

    toast.success('URL added!');
    setFormState({ slug: '', target: '' });
  };

  const handleReset = () => {
    setFormState({ slug: '', target: '' });
  };

  if (isMobile) {
    return (
      <div className="border rounded-md p-3 mb-3 bg-zinc-900">
        <div className="mb-2">
          <Input
            ref={slugRef}
            type="text"
            placeholder="Slug"
            value={formState.slug}
            onChange={e =>
              setFormState(prev => ({ ...prev, slug: e.target.value }))
            }
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div className="mb-2">
          <Input
            ref={targetRef}
            type="text"
            placeholder="Target URL"
            value={formState.target}
            onChange={e =>
              setFormState(prev => ({ ...prev, target: e.target.value }))
            }
            onFocus={() => {
              if (!formState.target) {
                setFormState(prev => ({ ...prev, target: 'https://' }));
              }
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleSave}
            disabled={isPending}
            size="icon"
            title="Save"
            aria-label="Save new URL"
          >
            <span className={isPending ? 'animate-pulse' : ''}>
              <Check className="h-4 w-4" />
            </span>
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="icon"
            title="Reset"
            aria-label="Reset URL form"
          >
            <span className={isPending ? 'animate-pulse' : ''}>
              <X className="h-4 w-4" />
            </span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="table-row">
      <div className="table-cell px-2 py-2 align-top">
        <Input
          ref={slugRef}
          type="text"
          placeholder="Slug"
          value={formState.slug}
          onChange={e =>
            setFormState(prev => ({ ...prev, slug: e.target.value }))
          }
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
          className="border px-2 py-1 rounded w-24"
        />
      </div>
      <div className="table-cell px-2 py-2 align-top items-center">→</div>
      <div className="table-cell px-2 py-2 align-top">
        <Input
          ref={targetRef}
          type="text"
          placeholder="Target URL"
          value={formState.target}
          onChange={e =>
            setFormState(prev => ({ ...prev, target: e.target.value }))
          }
          onFocus={() => {
            if (!formState.target) {
              setFormState(prev => ({ ...prev, target: 'https://' }));
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSave();
            }
          }}
          className="border px-2 py-1 rounded w-full"
        />
      </div>
      <div className="table-cell px-2 py-2 align-top"></div>
      <div className="table-cell px-2 py-2 align-top">
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isPending}
            size="icon"
            title="Save"
            aria-label="Save new URL"
          >
            <span className={isPending ? 'animate-pulse' : ''}>
              <Check className="h-4 w-4" />
            </span>
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="icon"
            title="Reset"
            aria-label="Reset URL form"
          >
            <span className={isPending ? 'animate-pulse' : ''}>
              <X className="h-4 w-4" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
