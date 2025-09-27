import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRightLeft,
  History,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    name: 'Customers',
    href: '/customers',
    icon: Users,
    description: 'Manage customers'
  },
  {
    name: 'Transactions',
    href: '#',
    icon: CreditCard,
    description: 'Banking operations',
    children: [
      {
        name: 'Deposit',
        href: '/deposit',
        icon: ArrowDownRight,
        description: 'Add funds'
      },
      {
        name: 'Withdraw',
        href: '/withdraw',
        icon: ArrowUpRight,
        description: 'Withdraw funds'
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
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();

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
          
          <ScrollArea className="h-[calc(100vh-8rem)]">
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
        </div>
      </div>
    </div>
  );
}