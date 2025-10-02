'use client';

import { logout } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function LogoutButton() {
  const [, formAction] = useActionState(logout, null);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <form action={formAction}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </form>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Logout</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
