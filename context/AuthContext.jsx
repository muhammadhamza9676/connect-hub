"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);       // logged-in user data
//   const [loading, setLoading] = useState(true); // while fetching user

//   // Fetch user from API if token exists
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       fetch("/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data?.error) {
//             setUser(null);
//             localStorage.removeItem("token");
//           } else {
//             setUser(data);
//           }
//         })
//         .catch(() => {
//           setUser(null);
//           localStorage.removeItem("token");
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   // Login function
//   const login = (token) => {
//     localStorage.setItem("token", token);
//     fetch("/api/auth/me", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => res.json())
//       .then((data) => setUser(data));
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken); // ✅ store it in state
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.error) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
          } else {
            setUser(data);
          }
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken); // ✅ save new token in state
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${newToken}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}