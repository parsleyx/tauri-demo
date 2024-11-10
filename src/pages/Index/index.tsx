
import { useCallback, useEffect, useState } from "react";
import { Button, SelectItem, Select } from "@nextui-org/react";
import { Page } from "@/components/page";
import * as appApi from "@/api/app";
import * as gameResourcesApi from "@/api/game-resources";
import * as orderApi from "@/api/order";
import { useRecoilState } from "recoil";
import { customerServiceUrlState } from "@/stores/app";
import { exists } from '@tauri-apps/plugin-fs';
import { downloadDir } from '@tauri-apps/api/path';
import { useNavigate } from "react-router-dom";

export const IndexPage = () => {
    const [id, setId] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [, setCustomerServiceUrl] = useRecoilState(customerServiceUrlState);
    const [gameResources, setGameResources] = useState<gameResourcesApi.GameResource[]>([]);
    const navigate = useNavigate();
    const createOrder = useCallback(async (gameResourceId: string) => {
        const {order} = await orderApi.create(gameResourceId);
        return order.no;
    }, []);
    const jumpOrder = useCallback(async (order: orderApi.Order) => {
        if (order.status == 1) {
            navigate(`/orders/pay/${order.no}`);
        } else if (order.status == 2) {
            const dir = await downloadDir();
            const file = await exists(`${dir}/${order.no}.exe`);
            console.log("file", file);
            if (file) {
                // 打开下载页面
                console.log("打开下载页面");
                navigate(`/game/download/${order.no}`);
            }else{
                // 打开安装页面
                navigate(`/game/install/${order.no}`);
            }
        }   
    }, []);
    const openOrder = useCallback(async (gameResource: gameResourcesApi.GameResource) => {
        let no = gameResource?.last_order_no;
        if (!no) {
            no = await createOrder(gameResource.id);
        }
        let {order} = await orderApi.info(no);
        if (order.status == 5 || order.status == 3 || order.status == 4) {
            no = await createOrder(gameResource.id);
            const rep = await orderApi.info(no);
            order = rep.order;
        }
        jumpOrder(order);
    }, []);
    useEffect(() => {
        appApi.config().then((res) => {
            setCustomerServiceUrl(res.config.service_url);
        });
        gameResourcesApi.list(import.meta.env.VITE_GAME_ID).then((res) => {
            setGameResources(res.list);
        });
    }, []);
    return <Page>
        <div className="flex flex-col flex-1">
            <div className="w-full flex flex-col justify-between h-full mb-22">
                <div className="mt-4">
                    <p className="text-5xl font-medium text-white">欢迎回来，指挥官，</p>
                    <p className="text-5xl font-medium text-white">您的任务现在已开始。</p>
                </div>
                <div className="w-1/3 bg-white bg-opacity-60 p-3 rounded-md">
                    <div>
                        <Select placeholder="请选择要安装的版本" value={id} onChange={(e) => {
                            setId(e.target.value);
                        }}>
                            {gameResources.map((gameResource) => (
                                <SelectItem key={gameResource.id}>
                                    {gameResource.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <Button isDisabled={!id} isLoading={loading} size="lg" onClick={async () => {
                        if (!id) {
                            return;
                        }
                        setLoading(true);
                        try {
                            const gameResource = gameResources.find((item) => item.id === id);
                            if (gameResource) {
                                await openOrder(gameResource);
                            }
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setLoading(false);
                        }
                    }} className="bg-red-500 text-white rounded-md mt-3 w-full">立即安装</Button>
                </div>
            </div>
        </div>
    </Page>
}

