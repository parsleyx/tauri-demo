import React from "react";
import { NextUIProvider } from '@nextui-org/react'
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from 'recoil';
import "virtual:uno.css";
import "./main.css";

import { router } from "./router";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <NextUIProvider>
        <RouterProvider router={router} />
      </NextUIProvider>
    </RecoilRoot>
  </React.StrictMode>,
);
