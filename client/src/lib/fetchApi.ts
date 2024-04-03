import { toast } from "sonner";

interface FormData {
  [key: string]: string;
}

export const fetchApi = async (
  data: FormData,
  link: string,
  toastMsg1: string,
  toastMsg2: string,
  setLoading: (loading: boolean) => void,
  setFormData: (formData: FormData) => void
) => {
  try {
    setLoading(true);
    const res = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await res.json();
    if (res.ok) {
      setFormData({});
      toast(toastMsg1);
    } else {
      toast(toastMsg2);
    }
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast(JSON.stringify(error));
  } finally {
    setLoading(false);
  }
};
