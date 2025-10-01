import { createContext, useContext, useEffect, useState } from "react";

type UserProfile = {
  name: string;
  photoUrl: string;
};

type UserContextType = {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem("userProfile");
    return stored
      ? JSON.parse(stored)
      : { name: "Usuário", photoUrl: "" };
  });

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userProfile");
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
