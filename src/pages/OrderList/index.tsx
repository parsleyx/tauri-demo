import { useCallback, useEffect, useState } from "react";
import * as orderApi from "@/api/order";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Pagination,
  Spinner
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { downloadDir } from "@tauri-apps/api/path";
import { exists } from "@tauri-apps/plugin-fs";
// 生成一个 status 的 key value 对象
export const OrderStatus: Record<number, string> = {
  1: "待支付",
  2: "已支付",
  3: "已取消",
  4: "已退款",
  5: "已过期",
}
export const OrderListPage = () => {
  const [orders, setOrders] = useState<orderApi.Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [params, setParams] = useState<orderApi.ListParams>({
    page: 1,
    limit: 20,
    q: "",
    game_id: import.meta.env.VITE_GAME_ID,
  })
  const jumpOrder = useCallback(async (order: orderApi.Order) => {
    if (order.status == 1) {
      navigate(`/orders/pay/${order.no}`);
    } else if (order.status == 2) {
      const dir = await downloadDir();
      const file = await exists(`${dir}/${order.no}.exe`);
      if (file) {
        // 打开下载页面
        navigate(`/game/download/${order.no}`);
      } else {
        // 打开安装页面
        navigate(`/game/install/${order.no}`);
      }
    }
  }, []);
  const loadOrders = useCallback((args: orderApi.ListParams) => {
    setLoading(true);
    orderApi.list(args).then((res) => {
      setOrders(res.list);
      setParams({ ...params, page: res.page, limit: res.limit });
      setTotal(res.total);
    }).finally(() => {
      setLoading(false);
    })
  }, [params])
  useEffect(() => {
    loadOrders({ ...params, page: 1, limit: 20 });
  }, []);
  return <div className="flex flex-col flex-1">
    <div className="flex px-4 py-8 justify-between">
      <Button className="mr-1 rounded-full" onClick={() => navigate(-1)} variant="bordered">返回</Button>
      <div className="flex items-center">
        <Input onValueChange={(v) => {
          setParams({ ...params, q: v });
        }} className="mr-2 rounded-full" value={params.q} onChange={(e) => setParams({ ...params, q: e.target.value })} placeholder="输入订单号查询" />
        <Button color="primary" onClick={() => {
          if (loading) return;
          loadOrders(params);
        }}>查询</Button>
      </div>
    </div>
    <div className="flex flex-col flex-1">
      <Table
        bottomContent={<div className="flex justify-center">
          {total > params.limit ? <Pagination onChange={(p) => {
            loadOrders({ ...params, page: p });
          }} page={params.page} total={Math.ceil(total / params.limit)} initialPage={1} /> : null}
        </div>}>
        <TableHeader>
          <TableColumn>订单号</TableColumn>
          <TableColumn>游戏版本</TableColumn>
          <TableColumn>时间</TableColumn>
          <TableColumn>订单金额</TableColumn>
          <TableColumn>状态</TableColumn>
          <TableColumn>操作</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={<div className="flex justify-center">
            <span className="text-sm text-zinc-400">暂无数据</span>
          </div>}
          isLoading={loading} loadingContent={<div className="flex justify-center">
            <Spinner />
          </div>}>
          {orders.map(order => <TableRow key={order.no}>
            <TableCell className="text-xs" width="10%">{order.no}</TableCell>
            <TableCell className="text-xs" width="20%">{order.title}</TableCell>
            <TableCell className="text-xs" width="20%">{order.created_at}</TableCell>
            <TableCell className="text-red-500  text-xs" width="20%">¥ {(order.amount / 100).toFixed(2)}</TableCell>
            <TableCell className="text-red-400 text-xs" width="20%">{OrderStatus[order.status]}</TableCell>
            <TableCell>
              <Button size="sm" color="primary" variant="ghost" onClick={() => {
                if (order.status == 1 || order.status == 2) {
                  jumpOrder(order);
                } else {
                  if (order.status == 3) {
                    alert("订单已取消");
                  } else if (order.status == 5) {
                    alert("订单已过期");
                  } else if (order.status == 4) {
                    alert("订单已退款");
                  }
                }
              }}>查看订单</Button>
            </TableCell>
          </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>;
}
