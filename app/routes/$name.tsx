import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params, request }: LoaderFunctionArgs) {
    return json({ name: params.name || '', url: request.url });
}

const Dynamic = () => {
    const { name, url } = useLoaderData<typeof loader>();
    return (<div>
        <div>Name: {name}</div>
        <div>URL: {url}</div>
    </div>);
}

export default Dynamic;