
import { useCallback, useEffect, useRef, useState } from "react";
import { Page } from "@/components/page";
import { useNavigate, useParams } from "react-router-dom";
import * as orderApi from "@/api/order";
import { Button, Spinner } from "@nextui-org/react";
import QRCode from "react-qr-code";
import { downloadDir } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
export const OrderPayPage = ({ }) => {
    const { no } = useParams<{ no: string }>();
    const navigate = useNavigate();
    const [payConfig, setPayConfig] = useState<orderApi.PayConfig>();
    const [payType, setPayType] = useState<number>(0);
    const [payUrl, setPayUrl] = useState<string>();
    const [order, setOrder] = useState<orderApi.Order>();
    const loadingRef = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout>();
    const loadPayConfig = useCallback(async (v: string) => {
        orderApi.payConfig(v).then((res) => {
            setPayConfig(res.pay_config);
            setPayUrl(res.pay_config.pay_list[0].url);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(() => {
                console.log("查询订单状态", v);
                loadOrder(v);
            }, 2000);
        }).catch(() => {
            alert("获取支付配置失败");
        });
    }, []);
    const jumpOrder = useCallback(async (order: orderApi.Order) => {
        if (order.status == 1) {
          navigate(`/orders/pay/${order.no}`);
        } else if (order.status == 2) {
          const dir = await downloadDir();
          const file = await exists(`${dir}/${order.no}.exe`);
          if (!file) {
            // 打开下载页面
            console.log("打开下载页面");
            navigate(`/game/download/${order.no}`);
          } else {
            // 打开安装页面
            navigate(`/game/install/${order.no}`);
          }
        }
      }, []);
    const loadOrder = useCallback(async (v: string) => {
        if (loadingRef.current) {
            return;
        }
        loadingRef.current = true;
        orderApi.info(v).then((res) => {
            setOrder(res.order);
            if (res.order.status === 2) {
                clearInterval(intervalRef.current);
                intervalRef.current = undefined;
                jumpOrder(res.order);
            }
        }).finally(() => {
            loadingRef.current = false;
        });
    }, []);
    useEffect(() => {
        if (no) {
            loadOrder(no);
            loadPayConfig(no);
        }
    }, [no]);
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, []);
    return <Page>
        <div className="w-1/2 bg-white bg-opacity-70 p-3 rounded-md flex flex-col flex-1 mb-4">
            <div className="flex justify-center">
                <span className="text-lg font-bold">订单详情</span>
            </div>
            <div className="flex flex-col">
                <span className="text-base">游戏版本：{order?.title}</span>
                <span className="text-base">游戏说明：{order?.sub_title}</span>
                <span className="text-base">订单号：{order?.no}</span>
                <div>
                    <span className="text-base">应付金额：<span className=" text-lg text-red-500 font-bold">¥ {((order?.amount ?? 0) / 100).toFixed(2)}</span></span>
                    <span className="text-sm text-red-500">{order?.amount_desc}</span>
                </div>
            </div>
            <div className="flex w-full mt-4">
                <div className="w-1/2">
                    <div className="w-full h-full flex flex-row items-start">

                        {payUrl ? <div className="w-[90%] bg-white border-8 border-blue-500 rounded-md flex flex-col items-center justify-center pt-8">
                            <QRCode className="w-[120px] h-[120px] mb-4" value={payUrl} />
                            <span className="text-xs text-gray-500 mb-2">请使用<span className="text-blue-500">{payConfig?.pay_list[payType].name}</span>扫码</span>
                        </div> : <></>}
                    </div>
                </div>
                <div className="w-1/2 flex flex-col">
                    <div className="flex flex-1 flex-wrap">
                        {
                            payConfig?.pay_list.map((item, index) => {
                                return <Button
                                    key={index}
                                    size="lg"
                                    onClick={() => {
                                        setPayType(index)
                                        setPayUrl(item.url);
                                    }}
                                    color={payType === index ? "primary" : "default"}
                                    className="w-full mt-2 bg-white justify-start"
                                    variant="bordered">
                                    <div className="w-full flex flex-row justify-between items-center">
                                        <div className="flex flex-row items-center">
                                            <img className="h-6 mr-2" src={item.icon} alt={item.name} />
                                            <span>{item.name}</span>
                                        </div>
                                        <div>
                                            {index === payType ? <img src="/check.png" alt="" className="h-8" /> : <></>}
                                        </div>
                                    </div>
                                </Button>
                            })
                        }
                    </div>
                    <div className="flex flex-1 flex-row items-end">
                        <Button onClick={() => {
                            navigate('/');
                        }} size="lg" className="w-full mt-2 bg-red-500 text-white border-none" variant="bordered">
                            <span>返回重选</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-1 flex-row items-end">
                <Spinner size="sm" color="default" />
                <span className="ml-2 text-sm text-gray-500">安装程序，将在付款后运行</span>
            </div>
        </div>
    </Page>
}

