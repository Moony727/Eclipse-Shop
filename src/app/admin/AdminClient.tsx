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
  Send,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function AdminClient() {
  const { firebaseUser } = useAuth();
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchId, setSearchId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!firebaseUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = await firebaseUser.getIdToken();
      const result = await getOrdersForAdmin(token);
      if (result.success && result.data) {
        setOrders(result.data);
        setFilteredOrders(result.data);
        setError(null);
      } else {
        const errorMsg = result.error || t("admin.failedToFetchOrders", "Failed to fetch orders");
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : t("admin.errorOccurred", "An error occurred while fetching orders");
      setError(errorMsg);
      console.error("Error fetching orders:", error);
      toast.error(errorMsg);
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
        order.id.toLowerCase().includes(searchId.toLowerCase())
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
        toast.success(`${t("admin.orderUpdated", "Order updated to")} ${t(`admin.${newStatus}`, newStatus)}`);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        toast.error(result.error || t("admin.failedToUpdateOrder", "Failed to update status"));
      }
    } catch {
      toast.error(t("admin.errorOccurred", "An error occurred while updating status"));
    } finally {
      setIsUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">{t("admin.requested", "Requested")}</Badge>;
      case 'process': return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">{t("admin.processing", "Processing")}</Badge>;
      case 'completed': return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">{t("admin.completed", "Completed")}</Badge>;
      case 'cancelled': return <Badge variant="destructive">{t("admin.cancelled", "Cancelled")}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{t("admin.loadingOrders", "Loading orders...")}</p>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t("admin.tryAgain", "Try Again")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <Button 
              onClick={() => setError(null)} 
              variant="ghost" 
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t("admin.orderManagement", "Order Management")}</h1>
          <p className="text-muted-foreground">{t("admin.manageOrdersDesc", "Manage and track customer orders")}</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" size="sm" className="w-fit">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {t("admin.refresh", "Refresh")}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t("admin.checkOrderId", "Check Order ID...")}
          className="pl-10 h-12 text-lg"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("admin.orderDetails", "Order Details")}</TableHead>
              <TableHead>{t("admin.customer", "Customer")}</TableHead>
              <TableHead>{t("admin.contact", "Contact")}</TableHead>
              <TableHead>{t("admin.status", "Status")}</TableHead>
              <TableHead className="text-right">{t("admin.actions", "Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  {t("admin.noOrdersFound", "No orders found")}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-bold flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">#{order.id.slice(-6).toUpperCase()}</span>
                        {order.productName ? (order.productName[language] || order.productName.en) : (order.items?.[0]?.productName?.[language] || order.items?.[0]?.productName?.en || t("common.unknown", "Unknown Product"))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                      <div className="font-bold text-primary">
                        {order.totalAmount} AZN
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{order.customerName || order.userName}</div>
                      <div className="text-xs text-muted-foreground">{order.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
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
                          className="h-8"
                          disabled={isUpdating === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'process')}
                        >
                          {t("admin.process", "Process")}
                        </Button>
                      )}
                      {order.status === 'process' && (
                        <Button
                          size="sm"
                          className="h-8 bg-green-600 hover:bg-green-700"
                          disabled={isUpdating === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                        >
                          {t("admin.complete", "Complete")}
                        </Button>
                      )}
                      {(order.status === 'requested' || order.status === 'process') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={isUpdating === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                        >
                          {t("admin.cancel", "Cancel")}
                        </Button>
                      )}
                      {order.status === 'completed' && (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
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
