import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { CartContext } from "../context/CartContext";
import { addressApi, orderApi, paymentApi } from "../api/endpoints";

const addressSchema = z.object({
  label: z.string().optional(),
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
});

export default function Checkout() {
  const { items, subtotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({ resolver: zodResolver(addressSchema) });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    addressApi.list().then((addrs) => {
      setAddresses(addrs);
      if (addrs.length > 0) setSelectedAddress(addrs[0].id);
    }).catch(() => {});
  }, [items, navigate]);

  const handleCreateAddress = async (data) => {
    try {
      const addr = await addressApi.create(data);
      setAddresses((prev) => [addr, ...prev]);
      setSelectedAddress(addr.id);
      setShowNewForm(false);
      form.reset();
      toast.success("Address added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }
    setSubmitting(true);
    try {
      const order = await orderApi.create({ addressId: selectedAddress });
      await paymentApi.create({ orderId: order.id, method: paymentMethod });
      clearCart();
      toast.success("Order placed!");
      navigate(`/orders/${order.id}`);
    } catch (err) {
      toast.error(err.message);
    }
    setSubmitting(false);
  };

  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              {addresses.length > 0 && !showNewForm ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label key={addr.id} className="flex items-start gap-3 rounded-md border p-3 cursor-pointer has-[:checked]:border-primary">
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium">{addr.label || "Address"}</p>
                        <p className="text-sm text-muted-foreground">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city},{" "}
                          {addr.state} {addr.zipCode}
                        </p>
                      </div>
                    </label>
                  ))}
                  <Button variant="outline" onClick={() => setShowNewForm(true)} className="w-full">
                    + Add New Address
                  </Button>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(handleCreateAddress)} className="space-y-3">
                  <Input placeholder="Label (e.g. Home)" {...form.register("label")} />
                  <Input placeholder="Address line 1 *" {...form.register("line1")} />
                  {form.formState.errors.line1 && (
                    <p className="text-xs text-destructive">{form.formState.errors.line1.message}</p>
                  )}
                  <Input placeholder="Address line 2 (optional)" {...form.register("line2")} />
                  <div className="grid grid-cols-3 gap-3">
                    <Input placeholder="City *" {...form.register("city")} />
                    <Input placeholder="State *" {...form.register("state")} />
                    <Input placeholder="ZIP *" {...form.register("zipCode")} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Save</Button>
                    {addresses.length > 0 && (
                      <Button type="button" variant="outline" onClick={() => setShowNewForm(false)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center gap-3 rounded-md border p-3 has-[:checked]:border-primary">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit / Debit Card</Label>
                </div>
                <div className="flex items-center gap-3 rounded-md border p-3 has-[:checked]:border-primary">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Button className="w-full" disabled={submitting} onClick={handleSubmit}>
                {submitting ? "Placing Order..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
