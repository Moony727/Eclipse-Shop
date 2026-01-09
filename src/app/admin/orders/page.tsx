"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Order } from "@/types";
import { getOrdersForAdmin, updateOrderStatus } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Search,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Phone,
  Send
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const { firebaseUser } = useAuth();
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchId, setSearchId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!firebaseUser) return;
    setIsLoading(true);
    try {
      const token = await firebaseUser.getIdToken();
      // Using a direct fetch if Server Action fails with 405
      const result = await getOrdersForAdmin(token);
      if (result.success && result.data) {
        setOrders(result.data);
        setFilteredOrders(result.data);
      } else {
        toast.error(result.error || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
    } finally {
      setIsLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (searchId.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) =>
        order.id.toLowerCase().includes(searchId.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchId.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchId.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchId, orders]);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    if (!firebaseUser) return;
    setIsUpdating(orderId);
    try {
      const token = await firebaseUser.getIdToken();
      const result = await updateOrderStatus(orderId, newStatus, token);
      if (result.success) {
        toast.success(`Order updated to ${newStatus}`);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch {
      toast.error("An error occurred while updating status");
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Requested</Badge>;
      case 'process': return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Processing</Badge>;
      case 'completed': return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">Review and process customer orders</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" size="sm" className="w-fit" disabled={isLoading}>
          <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by ID, Name or Email..."
          className="pl-10 h-10"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading orders...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-bold flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground">#{order.id.slice(-6).toUpperCase()}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                      <div className="font-bold text-primary text-sm">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.items && order.items.length > 0 ? (
                        <div className="text-xs">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}:
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="truncate max-w-32">
                              {item.quantity}x {item.productName[language] || item.productName.en}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-muted-foreground">+{order.items.length - 2} more</div>
                          )}
                        </div>
                      ) : (
                        // Legacy single item
                        <div className="text-xs truncate max-w-32">
                          1x {order.productName?.[language] || order.productName?.en || 'Unknown'}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{order.customerName || order.userName}</div>
                      <div className="text-[10px] text-muted-foreground">{order.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs">
                      {order.contactType === 'whatsapp' ? (
                        <Phone className="w-3 h-3 text-green-500" />
                      ) : (
                        <Send className="w-3 h-3 text-blue-500" />
                      )}
                      <span className="font-mono">{order.contactId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'requested' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          disabled={isUpdating === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'process')}
                        >
                          Process
                        </Button>
                      )}
                      {order.status === 'process' && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-green-600 hover:bg-green-700"
                          disabled={isUpdating === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      {(order.status === 'requested' || order.status === 'process') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={isUpdating === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      )}
                      {order.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
