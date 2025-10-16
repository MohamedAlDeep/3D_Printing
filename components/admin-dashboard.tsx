"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Input as ShadInput } from '@/components/ui/input';

type User = {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  gender: string | null;
  type: string;
  address?: string | null;
  createdAt: string; // serialized
}

type Order = {
  id: number;
  status: string;
  price: string;
  print_time: string;
  createdAt: string; // serialized
  userEmail: string;
}

type Props = {
  initialUsers: User[];
  initialOrders: Order[];
}

export default function AdminDashboard({ initialUsers, initialOrders }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isPending, startTransition] = useTransition();
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [userId, setUserId] = useState('');
  const [userType, setUserType] = useState<string | undefined>(undefined);
  const [userGender, setUserGender] = useState<string | undefined>(undefined);
  const [userHasAddress, setUserHasAddress] = useState<string>('any');
  const [userCreatedFrom, setUserCreatedFrom] = useState<string>('');
  const [userCreatedTo, setUserCreatedTo] = useState<string>('');
  const [orderQuery, setOrderQuery] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState<string | undefined>(undefined);
  const [orderUserEmail, setOrderUserEmail] = useState<string>('');
  const [orderCreatedFrom, setOrderCreatedFrom] = useState<string>('');
  const [orderCreatedTo, setOrderCreatedTo] = useState<string>('');

  async function updateUser(userId: number, patch: Partial<User>) {
    setInfo(null); setError(null);
    try {
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, patch }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update user');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...patch } : u));
      setInfo('User updated');
    } catch (e: any) { setError(e.message || 'Error'); }
  }

  async function deleteUser(userId: number) {
    setInfo(null); setError(null);
    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete user');
      setUsers(prev => prev.filter(u => u.id !== userId));
      setInfo('User deleted');
    } catch (e: any) { setError(e.message || 'Error'); }
  }

  async function updateOrder(orderId: number, patch: Partial<Order>) {
    setInfo(null); setError(null);
    try {
      const res = await fetch('/api/admin/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, patch }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update order');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...patch } : o));
      setInfo('Order updated');
    } catch (e: any) { setError(e.message || 'Error'); }
  }

  async function deleteOrder(orderId: number) {
    setInfo(null); setError(null);
    try {
      const res = await fetch('/api/admin/orders/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete order');
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setInfo('Order deleted');
    } catch (e: any) { setError(e.message || 'Error'); }
  }

  async function searchUsers() {
    setInfo(null); setError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/users/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache: 'no-store',
          body: JSON.stringify({
            userId: userId || undefined,
            q: userQuery || undefined,
            type: userType || undefined,
            gender: userGender || undefined,
            hasAddress: userHasAddress === 'any' ? undefined : userHasAddress === 'yes',
            createdFrom: userCreatedFrom || undefined,
            createdTo: userCreatedTo || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Search failed');
        setUsers(
          data.users.map((u: any) => ({ ...u, createdAt: new Date(u.createdAt).toISOString(), address: u.address ?? null }))
        );
      } catch (e: any) { setError(e.message || 'Error'); }
    });
  }

  async function searchOrders() {
    setInfo(null); setError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/orders/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache: 'no-store',
          body: JSON.stringify({
            orderId: orderId || undefined,
            q: orderQuery || undefined,
            status: orderStatus || undefined,
            userEmail: orderUserEmail || undefined,
            createdFrom: orderCreatedFrom || undefined,
            createdTo: orderCreatedTo || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Search failed');
        setOrders(
          data.orders.map((o: any) => ({
            id: o.id,
            status: o.status,
            price: o.price,
            print_time: o.print_time,
            createdAt: new Date(o.createdAt).toISOString(),
            userEmail: o.user.email,
          }))
        );
      } catch (e: any) { setError(e.message || 'Error'); }
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        {info && <span className="text-green-600 text-sm">{info}</span>}
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-7 gap-3 items-end">
            <div>
              <Label>User ID</Label>
              <Input placeholder="e.g. 12" value={userId} onChange={(e) => setUserId(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Search</Label>
              <Input placeholder="name, email, phone, address" value={userQuery} onChange={(e) => setUserQuery(e.target.value)} />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={userType} onValueChange={(v) => setUserType(v)}>
                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={userGender} onValueChange={(v) => setUserGender(v)}>
                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Has address</Label>
              <Select value={userHasAddress} onValueChange={setUserHasAddress}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Created from</Label>
              <Input type="date" value={userCreatedFrom} onChange={(e) => setUserCreatedFrom(e.target.value)} />
            </div>
            <div>
              <Label>Created to</Label>
              <Input type="date" value={userCreatedTo} onChange={(e) => setUserCreatedTo(e.target.value)} />
            </div>
            <div className="md:col-span-7">
              <Button onClick={searchUsers} disabled={isPending}> {isPending ? 'Searching…' : 'Search users'} </Button>
            </div>
          </div>
          {users.map(u => (
            <div key={u.id} className="grid md:grid-cols-6 gap-3 items-end">
              <div className="md:col-span-2">
                <Label>Email</Label>
                <Input value={u.email} disabled />
              </div>
              <div>
                <Label>Name</Label>
                <Input defaultValue={u.name ?? ''} onBlur={(e) => updateUser(u.id, { name: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input defaultValue={u.phone ?? ''} onBlur={(e) => updateUser(u.id, { phone: e.target.value })} />
              </div>
              <div>
                <Label>Gender</Label>
                <Select defaultValue={u.gender ?? ''} onValueChange={(v) => updateUser(u.id, { gender: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type</Label>
                <Select defaultValue={u.type} onValueChange={(v) => updateUser(u.id, { type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Input defaultValue={u.address ?? ''} onBlur={(e) => updateUser(u.id, { address: e.target.value })} />
              </div>
              <div>
                <Button variant="destructive" onClick={() => deleteUser(u.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-7 gap-3 items-end">
            <div>
              <Label>Order ID</Label>
              <Input placeholder="e.g. 101" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Search</Label>
              <Input placeholder="price, print time, user email" value={orderQuery} onChange={(e) => setOrderQuery(e.target.value)} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={orderStatus} onValueChange={(v) => setOrderStatus(v)}>
                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="printing">Printing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>User email</Label>
              <Input placeholder="user@example.com" value={orderUserEmail} onChange={(e) => setOrderUserEmail(e.target.value)} />
            </div>
            <div>
              <Label>Created from</Label>
              <Input type="date" value={orderCreatedFrom} onChange={(e) => setOrderCreatedFrom(e.target.value)} />
            </div>
            <div>
              <Label>Created to</Label>
              <Input type="date" value={orderCreatedTo} onChange={(e) => setOrderCreatedTo(e.target.value)} />
            </div>
            <div className="md:col-span-7">
              <Button onClick={searchOrders} disabled={isPending}> {isPending ? 'Searching…' : 'Search orders'} </Button>
            </div>
          </div>
          {orders.map(o => (
            <div key={o.id} className="grid md:grid-cols-7 gap-3 items-end">
              <div>
                <Label>Order ID</Label>
                <Input value={o.id} disabled />
              </div>
              <div>
                <Label>User</Label>
                <Input value={o.userEmail} disabled />
              </div>
              <div>
                <Label>Status</Label>
                <Select defaultValue={o.status} onValueChange={(v) => updateOrder(o.id, { status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="printing">Printing</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Price</Label>
                <Input defaultValue={o.price} onBlur={(e) => updateOrder(o.id, { price: e.target.value })} />
              </div>
              <div>
                <Label>Print Time</Label>
                <Input defaultValue={o.print_time} onBlur={(e) => updateOrder(o.id, { print_time: e.target.value })} />
              </div>
              <div className="flex items-end h-full">
                <Button variant="outline" asChild title="Download STL">
                  <a href={`/api/download/${o.id}`}>
                    <Download className="h-4 w-4 mr-2" /> Download
                  </a>
                </Button>
              </div>
              <div>
                <Button variant="destructive" onClick={() => deleteOrder(o.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
