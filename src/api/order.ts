import { req } from "./req";
import queryString from "query-string";
export interface Order {
    no: string;
    game_resource_id: string;
    title: string;
    sub_title?: string;
    amount: number;
    amount_desc: string;
    // 订单状态 1: 待支付 2: 已支付 3: 已取消 4: 已退款 5: 已过期
    status: number;
    created_at: string;
    updated_at: string;
    paid_at: string;
    download_list?: string[];
}
export const create = async (gameResourceId: number): Promise<{
    no: string;
}> => {
    const formData = new FormData();
    formData.append('game_resource_id', gameResourceId.toString());
    const rep = await req.post(`api/orders/create`, {
        body: formData
    });
    console.log('create order rep@@@@@@@@',rep);
    const json:any = await rep.json();
    console.log('create order rep@@@@@@@@',json);
    return json?.data;
}

export const info = async (no: string): Promise<{
    order: Order;
}> => {
    const searchParams = queryString.stringify({ no });
    const rep = await req.get(`api/orders/info?${searchParams}`);
    const json:any = await rep.json();
    return json?.data;
}
export interface PayConfig {
    pay_list: {
        name: string;
        icon: string;
        type: string;
    }[];
}
export const payConfig = async (no: string): Promise<{
    pay_config: PayConfig;
}> => {
    const searchParams = queryString.stringify({ no });
    const rep = await req.get(`api/orders/pay-config?${searchParams}`);
    const json:any = await rep.json();
    return json?.data;
}
export const payData = async (no: string, payType: string): Promise<{
    qrcode_data: string;
}> => {
    const searchParams = queryString.stringify({ no, pay_type: payType });
    console.log('payData searchParams@@@@@@@@',searchParams);
    const rep = await req.get(`api/orders/pay-data?${searchParams}`);
    const json:any = await rep.json();
    console.log('payData json@@@@@@@@',json);
    return json?.data;
}
export type ListParams = {
    game_id: string,
    page: number,
    limit: number,
    q?: string
}
export const list = async (params: ListParams): Promise<{
    list: Order[];
    total: number;
    page: number;
    limit: number;
}> => {

    const searchParams = queryString.stringify(params);
    const rep = await req.get(`api/orders/list?${searchParams}`);
    const json:any = await rep.json();
    return json?.data;
}   