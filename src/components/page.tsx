
import { customerServiceUrlState, downloadingState } from "@/stores/app";
import { Button } from "@nextui-org/react";
import { open } from "@tauri-apps/plugin-shell";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
export const Page = ({ children }: { children: React.ReactNode }) => {
    const customerServiceUrl = useRecoilValue(customerServiceUrlState);
    const downloading = useRecoilValue(downloadingState);
    const navigate = useNavigate();
    return <div className="relative">
        <div>
            <img className="w-screen h-screen" src="/index-bg.jpg" alt="" />
        </div>
        <div className="absolute top-0 left-0 w-screen h-screen flex flex-col justify-between px-5 pt-8 pb-5">
            <div className="flex flex-row justify-between items-start">
                <div>
                    <img className="h-16" src="/logo.png" alt="" />
                </div>
                <div>
                    <div className="bg-white bg-opacity-60 p-2 rounded-md">
                        <Button size="md" className="bg-red-500 text-white mr-2 rounded-md" onClick={() => open(customerServiceUrl)}>
                            <img className="h-[20px]" src="/customer-service.png" alt="" />
                            联系客服
                        </Button>
                        <Button onClick={() => {
                            if (downloading) {
                                alert("下载中，请稍后再试");
                            } else {
                                navigate("/orders/list");
                            }
                        }} size="md" className="bg-red-500 text-white rounded-md">
                            <img className="h-[20px]" src="/order.png" alt="" />
                            我的订单
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-end h-full">
                {children}
                <div className="flex items-center mt-4">
                    <img className="h-6 mr-1" src="/game-company-icon.png" alt="" />
                    <span className="text-sm text-white">&copy; 2024 Electric Arts Inc.</span>
                </div>
            </div>
        </div>
    </div>;
}

