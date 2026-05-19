import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { orderApi } from "../api/endpoints";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";

const statusColors = {
  PENDING: "warning",
  CONFIRMED: "default",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "destructive",
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getById(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-6 h-48" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Order not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={statusColors[order.status]} className="text-sm px-4 py-1">
          {order.status}
        </Badge>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <Link to={`/products/${item.product.slug}`} className="font-medium hover:underline">
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} x ${Number(item.unitPrice).toFixed(2)}
                </p>
              </div>
              <span className="font-medium">${Number(item.total).toFixed(2)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>${Number(order.tax).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>${Number(order.shippingCost).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${Number(order.total).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            {order.address && (
              <p className="text-sm text-muted-foreground">
                {order.address.line1}
                {order.address.line2 && <>, {order.address.line2}</>}<br />
                {order.address.city}, {order.address.state} {order.address.zipCode}
              </p>
            )}
          </CardContent>
        </Card>

        {order.payment && (
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="font-medium">Method:</span> {order.payment.method}</p>
              <p><span className="font-medium">Status:</span> {order.payment.status}</p>
              <p><span className="font-medium">Transaction:</span> {order.payment.transactionId || "N/A"}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
