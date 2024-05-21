import {json, type LoaderFunctionArgs, type MetaFunction, redirect} from '@remix-run/node'
import {createSupabaseServerClient} from "~/supabase/supabase.server";
import {useLoaderData} from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {title: "New Remix App"},
    {name: "description", content: "Welcome to Remix!"},
  ];
};


export async function loader({request}: LoaderFunctionArgs) {
  const {supabase, headers} = createSupabaseServerClient(request);
  const {data, error} = await supabase.auth.getSession();
  if (error) {
    console.log(error);
    throw error;
  }
  if (!data.session) {
    return redirect('signin');
  }

  console.log(data.session.user.id)
  const {data: todos} = await supabase.from('todos').select('*').order('desc', {ascending: true});
  return json(todos, {headers})
}

export default function Index() {
  const todos = useLoaderData<typeof loader>();
  console.log(todos)
  return (
    <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.8"}}>
      <h1>Your Todos</h1>
      {todos ? <ul>
        {todos.map((t, index) => <li key={index}>{t.desc}</li>)}
      </ul> : <p>No Todos</p>}

    </div>
  );
}
