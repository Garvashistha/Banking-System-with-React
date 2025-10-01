import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRightLeft,
  History,
  Building2,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/auth-context';

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Account overview'
  },
  {
    name: 'Accounts',
    href: '#',
    icon: Building2,
    description: 'Account management',
    children: [
      {
        name: 'Savings Account',
        href: '/accounts/savings',
        icon: Building2,
        description: 'Savings account details'
      },
      {
        name: 'Current Account',
        href: '/accounts/current',
        icon: CreditCard,
        description: 'Current account details'
      },
      {
        name: 'View Balance',
        href: '/accounts/balance',
        icon: ArrowDownRight,
        description: 'View all balances'
      },
    ]
  },
  {
    name: 'Transactions',
    href: '#',
    icon: ArrowRightLeft,
    description: 'Banking operations',
    children: [
      {
        name: 'Withdraw',
        href: '/withdraw',
        icon: ArrowUpRight,
        description: 'Withdraw funds'
      },
      {
        name: 'Deposit',
        href: '/deposit',
        icon: ArrowDownRight,
        description: 'Add funds'
      },
      {
        name: 'Transfer',
        href: '/transfer',
        icon: ArrowRightLeft,
        description: 'Transfer between accounts'
      },
    ]
  },
  {
    name: 'History',
    href: '/history',
    icon: History,
    description: 'Transaction history'
  },
  {
    name: 'Profile',
    href: '#',
    icon: Users,
    description: 'Profile management',
    children: [
      {
        name: 'View Profile',
        href: '/profile/view',
        icon: Users,
        description: 'View your profile'
      },
      {
        name: 'Update Profile',
        href: '/profile/update',
        icon: Users,
        description: 'Update profile info'
      },
    ]
  },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={cn('pb-12 w-64', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">SecureBank</span>
          </div>
          
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2">
                        <div className="flex items-center space-x-3 text-sm font-medium text-muted-foreground">
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </div>
                      </div>
                      <div className="ml-6 space-y-1">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.href}
                            to={child.href}
                            className={({ isActive }) =>
                              cn(
                                'group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                  ? 'bg-gradient-primary text-white shadow-banking'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                              )
                            }
                          >
                            <child.icon className="h-4 w-4" />
                            <span>{child.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-gradient-primary text-white shadow-banking'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Logout Button */}
          <div className="pt-4 mt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}