import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
    return json({ name: params.name || '' });
}

const Dynamic = () => {
    const { name } = useLoaderData<typeof loader>();
    return (<div>You are at: {name}</div>);
}

export default Dynamic;