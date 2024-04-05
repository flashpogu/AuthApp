import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  interface RootState {
    user: {
      currentUser: {
        profilePicture: string;
        email: string;
        username: string;
      };
    };
  }
  const { currentUser } = useSelector((state: RootState) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
}
