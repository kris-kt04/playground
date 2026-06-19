import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  LayoutDashboard,
  BarChart3,
  MessageCircle,
  Zap,
  CreditCard,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import clsx from 'clsx';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: <BarChart3 size={20} />,
  },
  {
    name: 'AI Assistant',
    href: '/dashboard/chat',
    icon: <MessageCircle size={20} />,
  },
  {
    name: 'Integrations',
    href: '/dashboard/integrations',
    icon: <Zap size={20} />,
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: <CreditCard size={20} />,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings size={20} />,
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLogoutDialogOpen(false);
      await authClient.signOut();
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-svh w-64 bg-gray-950 border-r border-gray-800 flex flex-col pt-20 transition-transform duration-300 z-40 md:relative md:translate-x-0 md:top-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Close button for mobile */}
      <div className="md:hidden absolute top-4 right-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-800 hover:text-white',
              isActive(item.href) && 'bg-gray-800 text-white'
            )}
            onClick={onClose}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-800 p-4">
        <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-start gap-3 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border-gray-700"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You'll need to sign in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsLogoutDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700"
              >
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
