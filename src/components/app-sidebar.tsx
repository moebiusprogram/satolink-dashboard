import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconLayoutDashboard,
  IconArrowsLeftRight,
  IconCurrencyBitcoin,
  IconCurrencyDollar,
  IconGitBranch,
  IconRoute,
  IconGitBranch,
  IconScan,
  IconQrcode,
  IconReceiptRefund,
  IconDownload,
  IconWallet,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import {
  emailAtom,
  usernameAtom,
  accountIDAtom,
  avatarAtom,
} from "@/store/users";

const data = {
  navMain: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      name: "LNURL-Pay",
      url: "/pay",
      icon: IconScan,
    },
    {
      name: "LNURL-Widthdraw",
      url: "/widthdraw",
      icon: IconReceiptRefund,
    },
    {
      name: "My SatoLink Wallet",
      url: "wallet",
      icon: IconWallet,
    },
  ],
  navClouds: [
    {
      name: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          name: "Active Proposals",
          url: "#",
        },
        {
          name: "Archived",
          url: "#",
        },
      ],
    },
    {
      name: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          name: "Active Proposals",
          url: "#",
        },
        {
          name: "Archived",
          url: "#",
        },
      ],
    },
    {
      name: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          name: "Active Proposals",
          url: "#",
        },
        {
          name: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      name: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      name: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
  ],
  satolink: [
    {
      name: "Transactions",
      url: "/transactions",
      icon: IconArrowsLeftRight,
    },
    {
      name: "BTC Invoices",
      url: "/btc-invoices",
      icon: IconCurrencyBitcoin,
    },
    {
      name: "USDT Invoices",
      url: "/usdt-invoices",
      icon: IconCurrencyDollar,
    },
    {
      name: "Channels",
      url: "/channels",
      icon: IconRoute,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [username] = useAtom(usernameAtom);
  const [email] = useAtom(emailAtom);
  const [avatar] = useAtom(avatarAtom);

  const userData = {
    name: username,
    email: email,
    avatar: avatar,
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="mb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to="/" className="" style={{ width: "200px" }}>
                <img src="/263.avif" alt="logo" style={{ width: "200px" }} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.satolink} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
