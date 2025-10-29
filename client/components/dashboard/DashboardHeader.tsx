import { useRouter } from 'next/navigation';
import { LogOut, User, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { Z_INDEX, ICON_SIZES } from '@/lib/design-system';
import { ModeToggle } from '@/components/portfolio/mode-toggle';

export function DashboardHeader() {
  const { user, signout } = useAuth();
  const router = useRouter();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={`border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 ${Z_INDEX.sticky}`}>
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold">Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <ModeToggle />
          
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
            <Bell className={ICON_SIZES.md} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="text-xs sm:text-sm">{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                <User className={`mr-2 ${ICON_SIZES.sm}`} />
                <span className="text-sm">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signout}>
                <LogOut className={`mr-2 ${ICON_SIZES.sm}`} />
                <span className="text-sm">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
