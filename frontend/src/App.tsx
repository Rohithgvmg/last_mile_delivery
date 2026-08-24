import { useState } from "react";

import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrderForm from "./components/OrderForm";

function App() {
  const { user, logout } = useAuth();

  const [showRegister, setShowRegister] =
    useState(false);

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

  return (
    <div>
      <header>
        <h2>Last Mile Delivery</h2>

        <p>
          Welcome, {user.name}
        </p>

        <p>
          Role: {user.role}
        </p>

        <button onClick={logout}>
          Logout
        </button>
      </header>

      <hr />

      <OrderForm />
    </div>
  );
}

export default App;