import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  signOut,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "@/redux/user/userSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { app } from "@/firebase";

export default function ProfilePage() {
  interface FormDataState {
    [key: string]: string;
  }
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [imagePer, setImagePer] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState<FormDataState>({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };
  const dispatch = useDispatch();
  interface RootState {
    user: {
      currentUser: {
        profilePicture: string;
        email: string;
        username: string;
        _id: string;
      };
    };
  }
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image: File) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePer(Math.round(progress));
      },
      (error) => {
        setImageError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };
  const handleClick = async () => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };
  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
      toast("You are logged out 🤨");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center mt-10 gap-5 ">
      <div>
        <input
          id="profilePicture"
          type="file"
          accept="image/*"
          ref={filePickerRef}
          hidden
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              setImage(files[0]);
              handleChange;
            }
          }}
        />
        <Avatar className="w-24 h-24 cursor-pointer">
          <AvatarImage
            onClick={() => filePickerRef.current?.click()}
            className="z-0"
            src={formData.profilePicture || currentUser.profilePicture}
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <p className="text-sm text-gray-800">
        {imageError ? (
          <span className="text-red-700">Error uploading image</span>
        ) : imagePer > 0 && imagePer < 100 ? (
          <span className="text-slate-700">{`Uploading: ${imagePer}%`}</span>
        ) : imagePer === 100 ? (
          <span className="text-gray-700">Image uploaded successfully</span>
        ) : (
          ""
        )}
      </p>
      <div>
        <Tabs
          defaultValue="account"
          className="w-[400px] border border-gray-400 rounded-lg"
        >
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
                  <Input
                    id="email"
                    onChange={handleChange}
                    defaultValue={currentUser.email}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    onChange={handleChange}
                    defaultValue={currentUser.username}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">password</Label>
                  <Input
                    id="password"
                    onChange={handleChange}
                    type="password"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleClick}>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex items-center lg:w-1/4 w-3/4 justify-between">
        <button
          onClick={handleDeleteAccount}
          className="text-red-700 hover:text-red-900"
        >
          Delete Account
        </button>
        <button
          onClick={handleSignOut}
          className="text-red-700 hover:text-red-900"
        >
          Sign Out
        </button>
      </div>
      <p className="text-green-700 mt-5">
        {updateSuccess && "User is updated successfully!"}
      </p>
    </div>
  );
}
