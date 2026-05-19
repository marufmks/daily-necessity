import { useEffect, useState } from "react";
import { toast } from "sonner";
import { orderApi } from "../../api/endpoints";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

const statusColors = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrdersManage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    orderApi.listAll()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status);
      toast.success("Status updated");
      fetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-8"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user?.name} ({order.user?.email})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} items &middot; ${Number(order.total).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                  <Select
                    value={order.status}
                    onValueChange={(v) => handleStatusChange(order.id, v)}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
