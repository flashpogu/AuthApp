import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
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

export default function RegisterPage() {
  interface RootState {
    user: {
      loading: boolean;
    };
  }
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  interface FormData {
    [key: string]: string;
  }
  const [formData, setFormData] = useState<FormData>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const dataGet = await res.json();
      console.log(dataGet);
      if (dataGet.success === false) {
        dispatch(signInFailure(dataGet.success));
        toast("Something went wrong.😕");
      } else {
        dispatch(signInSuccess(dataGet));
        toast("Registered successfully!🫡");
        navigate("/login");
        setFormData({});
      }
    } catch (error) {
      dispatch(signInFailure(error));
      toast("Something went wrong.😕");
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col-reverse lg:flex-row lg:px-28 px-8 py-10">
      <div className="flex flex-col flex-1 gap-10 items-center border-y-2 border-l-2 border-gray-200 lg:rounded-y-xl lg:rounded-l-xl rounded-b-xl justify-center bg-gray-50 pt-10 lg:pt-0">
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-4xl font-semibold">Welcome Son!</h1>
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
            id="username"
            onChange={handleChange}
            type="text"
            placeholder="Username"
            value={formData.username || ""}
          />
          <Input
            id="email"
            onChange={handleChange}
            type="email"
            placeholder="Email"
            value={formData.email || ""}
          />
          <Input
            id="password"
            onChange={handleChange}
            type="password"
            placeholder="Password"
            value={formData.password || ""}
          />

          <Button disabled={loading} className="mt-6" type="submit">
            {loading ? "Loading..." : "Register"}
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
            Already a member?{" "}
            <Link to="/login" className="cursor-pointer font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
      <div className="lg:flex-1 lg:h-full">
        <img
          className="w-full rounded-t-xl lg:rounded-x-xl lg:rounded-r-xl object-cover"
          src="https://wallpapers-clan.com/wp-content/uploads/2022/11/rick-and-morty-matching-pfp-2.jpg"
          alt=""
        />
      </div>
    </div>
  );
}
