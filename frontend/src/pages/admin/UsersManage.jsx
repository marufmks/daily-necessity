import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { userApi } from "../../api/endpoints";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function UsersManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    userApi.list()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    try {
      await userApi.remove(id);
      toast.success("User deleted");
      fetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-8"><p className="text-muted-foreground">Loading...</p></div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Users</h1>

      {users.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No users found.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-md border p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.name}</span>
                  <Badge>{user.role}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive"
                onClick={() => handleDelete(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
