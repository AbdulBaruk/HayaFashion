import  { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserAPi } from "../api-endpoints/authendication";

interface UserContextType {
  user: any; 
  isAuthenticated: boolean; 
  isLoading: boolean; 
  error: any; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const userId: any = localStorage.getItem('userId');
  const { data, isLoading, error } = useQuery({
    queryKey: ["gerUserData",userId],
    queryFn: () => getUserAPi(`${userId}`),
    enabled:!!userId
  });

  if(data){
        localStorage.setItem('userName', data?.data?.name);
        localStorage.setItem('email', data?.data?.email);
  }

  return (
    <UserContext.Provider
      value={{
        user: data || [],
        isAuthenticated: !!data,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
}
