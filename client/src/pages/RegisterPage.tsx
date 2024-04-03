import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function RegisterPage() {
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
        <form className="flex flex-col gap-4 mx-40 lg:w-1/2 w-[75%]">
          <Input type="text" placeholder="Username" />
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />

          <Button className="mt-6" type="submit">
            Register
          </Button>
        </form>
        <div className="flex flex-col gap-6 items-center">
          <p className="text-sm">or continue with</p>
          <div className="flex gap-5">
            <div className="border-2 border-black p-2 rounded-full cursor-pointer">
              <FaGoogle size={35} />
            </div>
            <div className="border-2 border-black p-2 rounded-full cursor-pointer">
              <FaFacebook size={35} />
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
