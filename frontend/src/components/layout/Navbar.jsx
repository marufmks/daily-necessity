import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

function NavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const links = (
    <>
      <NavLink to="/products">Products</NavLink>
      {user && <NavLink to="/orders">Orders</NavLink>}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Daily Necessity
          </Link>
          <nav className="hidden items-center gap-6 md:flex">{links}</nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {cartCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    <Package className="mr-2 h-4 w-4" /> Orders
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/register")}>Register</Button>
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="mt-8 flex flex-col gap-4">
                <NavLink to="/products">Products</NavLink>
                {user && <NavLink to="/orders">Orders</NavLink>}
                {user && user.role === "ADMIN" && (
                  <NavLink to="/admin">Dashboard</NavLink>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
