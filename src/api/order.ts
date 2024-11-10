import { mock, req } from "./req";
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
mock.onPost('/api/orders/create').withDelayInMs(2000).reply(200, {
    order: {
        no: '1234567890',
        game_resource_id: '1234567890',
        title: '订单标题',
        amount: 100,
        status: 1,
        created_at: '2021-01-01 00:00:00',
        updated_at: '2021-01-01 00:00:00',
        paid_at: '2021-01-01 00:00:00',
    }
});
export const create = async (gameResourceId: string): Promise<{
    order: Order;
}> => {
    return await req.post(`/api/orders/create`, {
        game_resource_id: gameResourceId
    });
}
mock.onGet('/api/orders/info').withDelayInMs(1000).reply(200, {
    order: {
        no: '1234567890',
        game_resource_id: '1234567890',
        title: '订单标题',
        sub_title: '订单副标题',
        amount: 100,
        status: 2,
        created_at: '2021-01-01 00:00:00',
        updated_at: '2021-01-01 00:00:00',
        paid_at: '2021-01-01 00:00:00',
        download_list: [
            'https://huaxu.s3.bitiful.net/WePE_64_V2.3.exe',
            'https://huaxu.s3.bitiful.net/WePE_64_V2.3.exe',
        ]
    }
});
export const info = async (no: string): Promise<{
    order: Order;
}> => {
    return await req.get(`/api/orders/info`, {
        params: { no }
    });
}
export interface PayConfig {
    pay_list: {
        name: string;
        icon: string;
        url: string;
    }[];
}
mock.onGet('/api/orders/pay-config').reply(200, {
    pay_config: {
        pay_list: [
            {
                name: '微信支付',
                icon: 'https://pay.wechat.com/imgs/logo-small.e9caf3a4.png',
                url: 'https://example.com/pay2',
            },
            {
                name: '支付宝',
                icon: 'http://file.market.xiaomi.com/thumbnail/PNG/l62/AppStore/0cecd95939b8a4e1694a9ab47e765cbda5f4093c4',
                url: 'https://example.com/pay1',
            }
        ]
    }
});
export const payConfig = async (no: string): Promise<{
    pay_config: PayConfig;
}> => {
    return await req.get(`/api/orders/pay-config`, {
        params: { no }
    });
}
mock.onGet('/api/orders/list').withDelayInMs(2000).reply(200, {
    list: [
        {
            no: '1234567890',
            game_resource_id: '1234567890',
            title: '订单标题',
            amount: 100,
            status: 1,
            created_at: '2021-01-01 00:00:00',
            updated_at: '2021-01-01 00:00:00',
            paid_at: '2021-01-01 00:00:00',
        },
        {
            no: '1234567891',
            game_resource_id: '1234567890',
            title: '订单标题',
            amount: 100,
            status: 1,
            created_at: '2021-01-01 00:00:00',
            updated_at: '2021-01-01 00:00:00',
            paid_at: '2021-01-01 00:00:00',
        }
    ],
    total: 100,
    page: 1,
    limit: 20
}); 
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
    return await req.get(`/api/orders/list`, {
        params,
    });
}   