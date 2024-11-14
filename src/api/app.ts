import {req} from "./req";
export const config = async (): Promise<{
    config: {
        service_url: string;
    };
}> => {
    console.log(import.meta.env.VITE_API_BASE_URL);
    const rep =  await req.get("api/app/config");
    const json:any = await rep.json();
    return json?.data;
}