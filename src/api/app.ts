import {mock, req} from "./req";


mock.onGet("/api/app/config").reply(200, {
    config: {
        service_url: "https://service.example.com",
    }
});

export const config = async (): Promise<{
    config: {
        service_url: string;
    };
}> => {
    return await req.get("/api/app/config");
}