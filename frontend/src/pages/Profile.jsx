import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AuthContext } from "../context/AuthContext";
import { addressApi } from "../api/endpoints";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [newAddr, setNewAddr] = useState({
    label: "", line1: "", line2: "", city: "", state: "", zipCode: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    addressApi.list().then(setAddresses).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAddr.line1 || !newAddr.city || !newAddr.state || !newAddr.zipCode) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      const addr = await addressApi.create(newAddr);
      setAddresses((prev) => [addr, ...prev]);
      setNewAddr({ label: "", line1: "", line2: "", city: "", state: "", zipCode: "" });
      setShowForm(false);
      toast.success("Address added");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await addressApi.remove(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Profile</h1>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><span className="font-medium">Name:</span> {user?.name}</p>
          <p><span className="font-medium">Email:</span> {user?.email}</p>
          <p><span className="font-medium">Role:</span> <Badge>{user?.role}</Badge></p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Addresses</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {showForm && (
            <form onSubmit={handleCreate} className="space-y-3 rounded-md border p-4">
              <Input placeholder="Label (e.g. Home)" value={newAddr.label}
                onChange={(e) => setNewAddr((p) => ({ ...p, label: e.target.value }))} />
              <Input placeholder="Address line 1 *" value={newAddr.line1}
                onChange={(e) => setNewAddr((p) => ({ ...p, line1: e.target.value }))} />
              <Input placeholder="Address line 2" value={newAddr.line2}
                onChange={(e) => setNewAddr((p) => ({ ...p, line2: e.target.value }))} />
              <div className="grid grid-cols-3 gap-3">
                <Input placeholder="City *" value={newAddr.city}
                  onChange={(e) => setNewAddr((p) => ({ ...p, city: e.target.value }))} />
                <Input placeholder="State *" value={newAddr.state}
                  onChange={(e) => setNewAddr((p) => ({ ...p, state: e.target.value }))} />
                <Input placeholder="ZIP *" value={newAddr.zipCode}
                  onChange={(e) => setNewAddr((p) => ({ ...p, zipCode: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Save</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {addresses.length === 0 && !showForm && (
            <p className="text-sm text-muted-foreground">No addresses saved yet.</p>
          )}

          {addresses.map((addr) => (
            <div key={addr.id} className="flex items-start justify-between rounded-md border p-3">
              <div>
                <p className="font-medium">{addr.label || "Address"}</p>
                <p className="text-sm text-muted-foreground">
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city},{" "}
                  {addr.state} {addr.zipCode}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                onClick={() => handleDelete(addr.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
