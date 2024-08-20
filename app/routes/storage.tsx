import {
  ActionFunctionArgs, json, unstable_createFileUploadHandler, unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData, useFetcher } from "@remix-run/react";
import { createSupabaseServerClient } from "~/supabase/supabase.server";
import { useFileUpload } from "~/hooks/useFileUpload";


export async function action({ request }: ActionFunctionArgs) {
  // console.log(request.headers);

  const { headers, supabase } = createSupabaseServerClient(request);
  const { data: user, error: authError } = await supabase.auth.getUser();
  if (authError) {
    throw new Error(authError.message);
  }

  const userId = user.user.id;
  console.log("userID", userId);

  const files: { name: string, url: string }[] = [];

  const uploadHandler = unstable_composeUploadHandlers(
    // our custom upload handler
    async ({ name, contentType, data, filename }) => {
      console.log(name, contentType, filename);

      const dataArray1 = [];

      for await (const x of data) {
        dataArray1.push(x);
      }

      const file1 = new File(dataArray1, filename ?? 'no_name', { type: contentType });

      const { data: supaData, error } = await supabase.storage.from('images').upload(`${userId}/${filename}`, file1, { upsert: true });
      if (error) {
        throw new Error(error.message);
      }

      const { data: { publicUrl } } = await supabase.storage.from('images').getPublicUrl(`${userId}/${filename}`);
      files.push({ name: file1.name, url: publicUrl });
      return publicUrl;
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler()
  );


  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  // let files = formData.getAll("file") as NodeOnDiskFile[];
  return json({ files }, { headers });
}

type MyTabe = typeof action;

const Storage = () => {
  const actionData = useActionData<typeof action>();
  const { submit, isUploading, images } = useFileUpload<typeof action>();

  return <div>
    <h1>Storage</h1>
    <div>

      {/* Here we use our boolean to change the label text */}
      {isUploading ? <p>Uploading image...</p> : <p>Select an image</p>}

      <input
        name="file"
        type="file"
        multiple={true}
        onChange={(event) => {
          // console.log(event.currentTarget.files)
          submit(event.currentTarget.files)
        }}
      />


      <ul>
        {/*
         * Here we render the list of images, including the ones we're uploading
         * and the ones we've already uploaded
         */}
        {images.map((file) => {
          return <img key={file.name} src={file.url} />;
        })}
      </ul>
    </div>
  </div>
}

export default Storage;