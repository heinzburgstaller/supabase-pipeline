import { ActionFunctionArgs, SerializeFrom, TypedResponse } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";


type FileResponse = {
  files: {
      name: string;
      url: string;
  }[];
};

type UploadActonData = Awaited<TypedResponse<FileResponse>>

type MyFunctionType = ({ request }: ActionFunctionArgs) => Promise<TypedResponse<{ files: { name: string; url: string; }[] }>>;

export const useFileUpload = <T extends MyFunctionType>() => {
  const { submit, data, state, formData } = useFetcher<T>();
  const isUploading = state !== "idle";

  /*
  const uploadingFiles = formData
    ?.getAll("file")
    ?.filter((value: unknown): value is File => value instanceof File)
    .map((file) => {
      const name = file.name;
      // This line is important; it will create an Object URL, which is a `blob:` URL string
      // We'll need this to render the image in the browser as it's being uploaded
      let url = URL.createObjectURL(file);
      return { name, url };
    }); */

  const dataFiles = data
  const images = (data?.files ?? []);

  return {
    submit(files: FileList | null) {
      if (!files) return;
      let formData = new FormData();
      for (let file of files) formData.append("file", file);
      submit(formData, { method: "POST", encType: "multipart/form-data" });
    },
    isUploading,
    images,
  };
}
