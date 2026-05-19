import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { orderApi } from "../api/endpoints";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { EmptyState } from "../components/common/EmptyState";

const statusColors = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.list()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title="No orders yet"
          description="Place your first order to see it here."
          action={<Link to="/products"><Button>Browse Products</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Orders</h1>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()} &middot;{" "}
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${Number(order.total).toFixed(2)}</p>
                  <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
