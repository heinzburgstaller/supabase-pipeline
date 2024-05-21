import {Form, useActionData, useNavigation} from "@remix-run/react";
import {json} from "@remix-run/server-runtime";
import {createSupabaseServerClient} from "~/supabase/supabase.server";
import {ActionFunctionArgs, redirect} from "@remix-run/node";


// ActionFunction
export const action = async ({request}: ActionFunctionArgs) => {
  // Process form data and perform necessary actions
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error('Bad request')
  }

  const {supabase, headers} = createSupabaseServerClient(request);
  const {data, error} = await supabase.auth.signInWithPassword({email, password});
  if (error) {
    return json({success: false, errorMessage: error.message})
  }

  console.log(data.user?.email);
  return redirect('/', {headers});
};

export default function Signin() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'loading' || navigation.state === 'submitting';

  return <div><h1>Signin</h1>
    <Form method="post">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" placeholder="Enter E-Mail" name="email" required/>
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Enter Password" name="password" required/>
      </div>

      {actionData && !actionData.success ? <p>{actionData.errorMessage}</p> : null}

      <button disabled={isSubmitting} type="submit">Login</button>
    </Form>
  </div>
}