import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { EmptyState } from "../components/common/EmptyState";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem } = useContext(CartContext);
  const navigate = useNavigate();

  const handleUpdate = async (itemId, qty) => {
    try {
      await updateQuantity(itemId, qty);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId);
      toast.success("Item removed");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          icon={<ShoppingBag className="h-12 w-12" />}
          title="Your cart is empty"
          description="Add some products to get started."
          action={
            <Button onClick={() => navigate("/products")}>Browse Products</Button>
          }
        />
      </div>
    );
  }

  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full rounded-md object-cover" />
                  ) : (
                    "No img"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product.slug}`} className="font-medium hover:underline">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    ${Number(item.product.price).toFixed(2)} / {item.product.unit}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center rounded-md border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={item.quantity <= 1}
                        onClick={() => handleUpdate(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdate(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <span className="text-sm font-medium">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8 text-destructive"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders over $50
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
