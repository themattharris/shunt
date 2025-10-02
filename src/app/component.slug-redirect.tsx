'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SlugRedirect() {
  const [slug, setSlug] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (slug.trim()) {
      router.push(`/${slug.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={slug}
        onChange={e => setSlug(e.target.value)}
        placeholder="Enter a keyword..."
      />
      <Button type="submit">Go</Button>
    </form>
  );
}
