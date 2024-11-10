import { req,mock } from "./req";

export interface GameResource {
    id: string;
    game_id: string;
    name: string;
    last_order_no: string;
}
mock.onGet('/api/game-resources/list').reply(200, {
    list: [
        {
            id: '1234567890',
            game_id: '1234567890',
            name: '名称21234567890',
            last_order_no: '1234567890',
        },
        {
            id: '1234567891',
            game_id: '1234567890',
            name: '名称11234567890',
            last_order_no: '1234567890',
        },
    ]
});
export const list = async (gameId: string): Promise<{
    list: GameResource[];
}> => {
    return await req.get(`/api/game-resources/list`,{
        params: {
            game_id: gameId
        }
    });
}