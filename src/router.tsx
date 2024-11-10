import {
  createBrowserRouter,
} from "react-router-dom";
import { IndexPage } from "./pages/Index";
import { OrderPayPage } from "./pages/OrderPay";
import { GameDownloadPage } from "./pages/GameDownload";
import { OrderListPage } from "./pages/OrderList";
import { GameInstallPage } from "./pages/GameInstall";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
  },
  {
    path: "/orders/pay/:no",
    element: <OrderPayPage />,
  },
  {
    path: "/orders/list",
    element: <OrderListPage />,
  },
  {
    path: "/game/download/:no",
    element: <GameDownloadPage />,
  },
  {
    path: "/game/install/:no",
    element: <GameInstallPage />,
  }
]);
