import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Package, Users as UsersIcon, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { orderApi, userApi, productApi } from "../../api/endpoints";

function StatCard({ icon, label, value }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      orderApi.listAll(),
      productApi.list({ limit: 1 }),
      userApi.list(),
    ]).then(([orders, prods, users]) => {
      setRecentOrders(orders.slice(0, 5));
      setStats({
        orders: orders.length,
        products: prods.pagination?.total || 0,
        users: users.length,
        revenue: orders.reduce((sum, o) => sum + Number(o.total), 0),
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} label="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} />
        <StatCard icon={<Package className="h-4 w-4 text-muted-foreground" />} label="Orders" value={stats.orders} />
        <StatCard icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />} label="Products" value={stats.products} />
        <StatCard icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />} label="Users" value={stats.users} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{order.orderNumber}</span>
                    <span className="text-muted-foreground">
                      ${Number(order.total).toFixed(2)} &middot; {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/products" className="block rounded-md border p-3 text-sm font-medium hover:bg-accent transition-colors">
              Manage Products
            </Link>
            <Link to="/admin/orders" className="block rounded-md border p-3 text-sm font-medium hover:bg-accent transition-colors">
              Manage Orders
            </Link>
            <Link to="/admin/users" className="block rounded-md border p-3 text-sm font-medium hover:bg-accent transition-colors">
              Manage Users
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
