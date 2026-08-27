import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/auth.service";
import { ILogin } from "../interfaces/login.interface";
import { IRegister } from "../interfaces/register.interface";


export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, setUser, logout: storeLogout } = useAuthStore();

  const login = async (data: ILogin) => {
    const response = await authService.login(data);
    setUser({
      email: response.data.email,
      token: response.data.token,
      role: response.data.role,
      name: response.data.name,
    });
    router.push("/delivery/restaurants");
  };

  const register = async (data: IRegister) => {
    await authService.register(data);
    router.push("/auth/login");
  };

  const logout = () => {
    storeLogout();
    router.push("/auth/login");
  };

  return { user, isAuthenticated, isAdmin, login, register, logout };
}
