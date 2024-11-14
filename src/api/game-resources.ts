import queryString from "query-string";
import { req } from "./req";
export interface GameResource {
    id: number;
    game_id: string;
    name: string;
    last_order_no: string;
}
export const list = async (gameId: string): Promise<{
    list: GameResource[];
}> => {
    const searchParams = queryString.stringify({ game_id: gameId });
    const rep = await req.get(`api/game-resources/list?${searchParams}`);
    const json:any = await rep.json();
    return json?.data;
}