import {
  signInSuccess,
  signInFailure,
  signInStart,
} from "@/redux/user/userSlice";
import { toast } from "sonner";

interface FormData {
  [key: string]: string;
}

export const fetchApi = async (
  data: FormData,
  link: string,
  toastMsg1: string,
  toastMsg2: string,
  setFormData: (formData: FormData) => void,
  navigate: (navigateLink: string) => void,
  navigateLink: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any
) => {
  try {
    dispatch(signInStart());
    const res = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const dataGet = await res.json();
    if (dataGet.success) {
      dispatch(signInSuccess(dataGet));
      toast(toastMsg1);
    }

    if (res.ok) {
      navigate(navigateLink);
      dispatch(!signInStart());
      setFormData({});
    } else {
      dispatch(!signInStart());
      toast(toastMsg2);
    }
  } catch (error) {
    dispatch(signInFailure(error));
    console.log(error);
  }
};
