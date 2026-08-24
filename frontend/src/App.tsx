import { useState } from "react";

import { useAuth } from "./context/AuthContext";

import OrderForm from "./components/OrderForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const { user, logout } = useAuth();

  const [showRegister, setShowRegister] = useState(false);

  // Not logged in
  if (!user) {
    if (showRegister) {
      return (
        <RegisterPage
          onLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <LoginPage
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  // Logged in
  return (
    <div className="app">

      <nav className="navbar">

        <div className="logo">
          Last Mile Delivery
        </div>

        <div className="nav-user">

          <div className="user-info">

            <div className="user-name">
              Welcome, {user.name}
            </div>

            <div className="user-role">
              Role: {user.role}
            </div>

          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>
   
      <main>
        <OrderForm />
      </main>

    </div>
  );
}