import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightLeft, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { transactionApi } from '../lib/api';

export default function Transfer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      setErrors({ general: 'Please fill in all fields' });
      return;
    }
    
    if (formData.fromAccount === formData.toAccount) {
      setErrors({ toAccount: 'Destination account must be different from source account' });
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setErrors({ amount: 'Please enter a valid amount greater than 0' });
      return;
    }
    
    if (amount > 25000) {
      setErrors({ amount: 'Maximum transfer amount is $25,000' });
      return;
    }

    setLoading(true);
    
    try {
      const result = await transactionApi.transfer({
        fromAccount: formData.fromAccount,
        toAccount: formData.toAccount,
        amount: amount,
      });
      
      if (result.success) {
        toast({
          title: "Transfer Successful",
          description: `$${amount.toFixed(2)} has been transferred successfully.`,
        });
        navigate('/dashboard');
      } else {
        setErrors({ general: 'error' in result ? result.error : 'Transfer failed. Please try again.' });
        toast({
          variant: "destructive",
          title: "Transfer Failed",
          description: 'error' in result ? result.error : 'Please try again later.',
        });
      }
    } catch (error) {
      setErrors({ general: 'Network error occurred' });
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2">
        <ArrowRightLeft className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Transfer Funds</h1>
      </div>
      
      <Alert className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Transfers are processed immediately during business hours.
        </AlertDescription>
      </Alert>
      
      <Card className="max-w-md shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span>Transfer Money</span>
          </CardTitle>
          <CardDescription>
            Transfer funds between accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromAccount">From Account</Label>
              <Input
                id="fromAccount"
                type="text"
                placeholder="Enter source account number"
                value={formData.fromAccount}
                onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toAccount">To Account</Label>
              <Input
                id="toAccount"
                type="text"
                placeholder="Enter destination account number"
                value={formData.toAccount}
                onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                disabled={loading}
              />
              {errors.toAccount && (
                <p className="text-sm text-destructive">{errors.toAccount}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max="25000"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                disabled={loading}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>
            
            {errors.general && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {errors.general}
              </div>
            )}
            
            <div className="flex space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-primary"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Transfer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="max-w-md bg-muted/30 border-dashed">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Minimum transfer: $0.01</p>
            <p>• Maximum transfer: $25,000</p>
            <p>• Processing: Immediate</p>
            <p>• No transfer fees</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}