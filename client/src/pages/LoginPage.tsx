import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OAuthGoogle from "@/components/OAuthGoogle";
import OAuthFacebook from "@/components/OAuthFacebook";
import {
  signInSuccess,
  signInFailure,
  signInStart,
} from "@/redux/user/userSlice";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  interface FormData {
    [key: string]: string;
  }
  interface RootState {
    user: {
      loading: boolean;
    };
  }

  const { loading } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<FormData>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = formData;

    // Validate that either username or email is provided, but not both
    if (
      !username ||
      (username.includes("@") && username.includes(".") && password === "")
    ) {
      dispatch(
        signInFailure(
          "Please provide either a username or email address, and a password."
        )
      );
      toast("Invalid credentials. Please try again.");
      return;
    }

    try {
      dispatch(signInStart());

      const body = {
        ...(username.includes("@") && username.includes(".")
          ? { email: username }
          : { username }),
        password,
      };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(signInFailure(data.success));
        toast("Something went wrong.");
      } else {
        dispatch(signInSuccess(data));
        toast("Log in Sucessfully! ");
        navigate("/profile");
        setFormData({});
      }
    } catch (error) {
      dispatch(signInFailure(error));
      toast("Something went wrong.");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:px-28 px-8 py-10">
      <div className="flex flex-col flex-1 gap-10 items-center border-y-2 border-l-2 border-gray-200 lg:rounded-y-xl lg:rounded-l-xl rounded-b-xl justify-center bg-gray-50 pt-10 lg:pt-0">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl font-semibold">Welcome back!</h1>
          <p className="">
            login into the world of{" "}
            <span className="font-semibold text-gray-500">AuthApp</span>
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mx-40 lg:w-1/2 w-[75%]"
        >
          <Input
            onChange={handleChange}
            id="username"
            type="text"
            placeholder="Username"
            value={formData.username || ""}
          />
          <Input
            onChange={handleChange}
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password || ""}
          />
          <p className="text-sm self-end cursor-pointer">forgot password?</p>
          <Button disabled={loading} className="" type="submit">
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
        <div className="flex flex-col gap-6 items-center">
          <p className="text-sm">or continue with</p>
          <div className="flex gap-5">
            <div className="border-2 border-black p-2 rounded-full cursor-pointer">
              <OAuthGoogle />
            </div>
            <div className="border-2 border-black p-2 rounded-full cursor-pointer">
              <OAuthFacebook />
            </div>
          </div>
          <p className="text-sm mt-9">
            not a member?{" "}
            <Link to="/register" className="cursor-pointer font-semibold">
              Register now
            </Link>
          </p>
        </div>
      </div>
      <div className="lg:flex-1 lg:h-full">
        <img
          className="w-full rounded-t-xl lg:rounded-x-xl lg:rounded-r-xl object-cover"
          src="https://wallpapers-clan.com/wp-content/uploads/2022/11/rick-and-morty-matching-pfp-1.jpg"
          alt=""
        />
      </div>
    </div>
  );
}
