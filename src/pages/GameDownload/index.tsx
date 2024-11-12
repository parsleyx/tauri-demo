
import { useCallback, useEffect, useRef, useState } from "react";
import { Page } from "@/components/page";
import { useNavigate, useParams } from "react-router-dom";
import * as orderApi from "@/api/order";
import { Button, Progress } from "@nextui-org/react";
import { downloadDir } from "@tauri-apps/api/path";
import { exists, rename } from "@tauri-apps/plugin-fs";
import { download } from "@tauri-apps/plugin-upload";
import { useRecoilState, useRecoilValue } from "recoil";
import { v4 as uuidv4 } from 'uuid';
import { customerServiceUrlState, downloadingState } from "@/stores/app";
import { filesize } from "filesize";
export const GameDownloadPage = () => {
    const { no } = useParams<{ no: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<orderApi.Order>();
    const loadingRef = useRef(false);
    const customerServiceUrl = useRecoilValue(customerServiceUrlState);
    const [downloading, setDownloading] = useRecoilState(downloadingState);
    const downloadingRef = useRef(false);
    const [speed, setSpeed] = useState('');
    const [total, setTotal] = useState(0);
    const [progressText, setProgressText] = useState('0%');
    const downloadFile = useCallback(async (url: string, fileName: string) => {
        if (downloadingRef.current) {
            return;
        }
    
        downloadingRef.current = true;
        setDownloading(true);
        const dir = await downloadDir();
        const file = await exists(`${dir}/${fileName}`);
        if (file) {
            return;
        }
        const tmpFileName = `${uuidv4()}.dl`;
        const tmpFile = `${dir}/${tmpFileName}`;
        download(url, tmpFile, (res) => {
            setSpeed(filesize(res.transferSpeed));
            setTotal(res.total);
            const progressText = (res.progress/res.total).toFixed(2) + '%';
            console.log('下载中',progressText);
            setProgressText(progressText);
        }).then(() => {
            rename(tmpFile, `${dir}/${fileName}`);
            downloadingRef.current = false;
            setDownloading(false);
            navigate(`/game/install/${order?.no}`);
        }).catch((err: any) => {
            alert(err.message);
            downloadingRef.current = false;
            setDownloading(false);
        })
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
                if (file) {
                    navigate(`/game/install/${res.order.no}`);
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
                    if(downloadingRef.current) {
                        return;
                    }
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
                    <Button isLoading={downloading} disabled={downloading} size="sm" onClick={() => {
                        if (order?.download_list?.[0]) {
                            downloadFile(order?.download_list?.[0] ?? '', `${order?.no}.exe`);
                        }
                    }} className="w-full bg-red-500 text-white rounded-md mt-2">
                        下载游戏
                    </Button>
                    <span className="text-sm font-bold text-gray-600 mt-2">备注：如遇到下载问题，请<span className="text-red-500 cursor-pointer" onClick={() => open(customerServiceUrl)}>联系客服</span></span>
                </span>
            </div>
            <div className="flex flex-col items-center w-full mt-4">
                {downloading ? <>
                    <div className="w-4/5 flex items-center justify-between">
                        <span className="text-xs">正在下载...</span>
                        <span className="text-xs">{progressText}</span>
                        <span className="text-xs">{speed}/s</span>
                        <span className="text-xs">共{filesize(total,{
                            roundingMethod: 'ceil'
                        })}</span>
                    </div>
                    <div className="w-4/5 mt-2 flex flex-col items-center justify-center">
                        <Progress className="w-full" value={16} />
                    </div></> : null}
            </div>
        </div>
    </Page>
}

