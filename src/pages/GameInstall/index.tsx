
import { useCallback, useEffect, useRef, useState } from "react";
import { Page } from "@/components/page";
import { useNavigate, useParams } from "react-router-dom";
import * as orderApi from "@/api/order";
import { Button, Spinner } from "@nextui-org/react";
import { downloadDir } from "@tauri-apps/api/path";
import { exists, open } from "@tauri-apps/plugin-fs";
import { useRecoilValue } from "recoil";
import { customerServiceUrlState } from "@/stores/app";
export const GameInstallPage = () => {
    const { no } = useParams<{ no: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<orderApi.Order>();
    const loadingRef = useRef(false);
    const customerServiceUrl = useRecoilValue(customerServiceUrlState);
    const openFile = useCallback(async (file: string) => {
        try {
            await open(file);
        } catch (error) {
            console.error('Failed to launch .exe file:', error);
        }
    }, []);
    const loadOrder = useCallback(async (v: string) => {
        if (loadingRef.current) {
            return;
        }
        loadingRef.current = true;
        orderApi.info(v).then(async (res) => {
            setOrder(res.order);
            if (res.order.status != 2) {
                if (res.order.status == 1) {
                    navigate(`/orders/pay/${res.order.no}`);
                } else if (res.order.status == 3) {
                    alert("订单已取消");
                } else if (res.order.status == 4) {
                    alert("订单已退款");
                } else if (res.order.status == 5) {
                    alert("订单已过期");
                }
            } else {
                const dir = await downloadDir();
                const file = await exists(`${dir}/${res.order.no}.exe`);
                if (!file) {
                    navigate(`/game/download/${res.order.no}`);
                }
            }
        }).finally(() => {
            loadingRef.current = false;
        });
    }, []);
    useEffect(() => {
        if (no) {
            loadOrder(no);
        }
    }, [no]);
    return <Page>
    <div className="w-4/7 bg-white bg-opacity-80 p-3 rounded-md flex flex-col flex-1 mt-4">
        <div className="flex justify-end">
                <span className="text-sm text-red-500 cursor-pointer" onClick={() => {
                    navigate('/');
                }}>返回首页</span>
            </div>
            <div className="flex flex-col items-center justify-center">
                <img className="w-14" src="/check-red.png" alt="" />
                <span className="text-base font-bold">购买成功</span>
            </div>
            <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500 pt-2">{order?.no}</span>
                <span className="text-sm font-bold pb-4">{order?.title}</span>
                <span className="text-sm text-red-500 ">(赠品和游戏已打包...)</span>
                <span className="flex flex-col">
                    <Button size="sm" onClick={async () => {
                        if (await exists(`${order?.no}.exe`)) {
                            openFile(`${order?.no}.exe`);
                        } else {
                            navigate(`/game/download/${order?.no}`);
                        }
                    }} className="w-full bg-red-500 text-white rounded-md mt-2">
                        安装游戏
                    </Button>
                    <span className="text-xs font-bold text-gray-600 mt-2">备注：如遇到下载问题，请<span className="text-red-500 cursor-pointer" onClick={() => open(customerServiceUrl)}>联系客服</span></span>
                </span>
            </div>
            <div className="flex flex-1 flex-row items-end">
                <Spinner size="sm" color="default" />
                <span className="ml-2 text-xs text-gray-500">请点击“安装游戏”按钮，开始安装</span>
            </div>
        </div>
    </Page>
}

