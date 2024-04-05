import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
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
  console.log(image);
  return (
    <div className="flex flex-col justify-center items-center mt-10 gap-5 ">
      <div>
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          hidden
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              setImage(files[0]);
            }
          }}
        />
        <Avatar className="w-24 h-24 cursor-pointer">
          <AvatarImage
            onClick={() => filePickerRef.current?.click()}
            className="z-0"
            src={currentUser.profilePicture}
            alt="@shadcn"
          />

          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're
                  done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Email</Label>
                  <Input id="email" defaultValue={currentUser.email} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={currentUser.username} />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex items-center lg:w-1/4 w-3/4 justify-between">
        <button className="text-red-700 hover:text-red-900">
          Delete Account
        </button>
        <button className="text-red-700 hover:text-red-900">Sign Out</button>
      </div>
    </div>
  );
}
