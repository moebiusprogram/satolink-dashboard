import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./app/login.tsx";
import Signup from "./app/signup.tsx";
import Layout from "./app/layout.tsx";
import Transactions from "./app/transactions.tsx";
import BTCInvoices from "./app/btcInvoices.tsx";
import USDTInvoices from "./app/usdtInvoices.tsx";
import Channels from "./app/channels.tsx";
import Account from "./app/account.tsx";
import Settings from "./app/settings.tsx";
import Notifications from "./app/notifications.tsx";
import LnurlPay from "./app/lnurlPay.tsx";
import LnurlWidthdraw from "./app/lnurlWidthdraw.tsx";
import MySatolinkWallet from "./app/mySatolinkWallet.tsx";
import AddressBook from "./app/addressBook.tsx";
import Help from "./app/help.tsx";

import Dashboard from "./app/dashboard.tsx";
import ProtectedRoute from "./components/protected-route.tsx";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <Dashboard />,
          },
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/transactions",
            element: <Transactions />,
          },
          {
            path: "/btc-invoices",
            element: <BTCInvoices />,
          },
          {
            path: "/usdt-invoices",
            element: <USDTInvoices />,
          },
          {
            path: "/channels",
            element: <Channels />,
          },
          {
            path: "/settings",
            element: <Settings />,
          },
          {
            path: "/account",
            element: <Account />,
          },
          {
            path: "/notifications",
            element: <Notifications />,
          },
          {
            path: "/pay",
            element: <LnurlPay />,
          },
          {
            path: "/widthdraw",
            element: <LnurlWidthdraw />,
          },
          {
            path: "/wallet",
            element: <MySatolinkWallet />,
          },
          {
            path: "/help",
            element: <Help />,
          },
          {
            path: "/address-book",
            element: <AddressBook />,
          },
        ],
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "*",
    element: <Login />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
