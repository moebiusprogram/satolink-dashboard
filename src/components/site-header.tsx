import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BellIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAtom } from "jotai";
import { notificationsAtom } from "@/store/notfications";
//import { Icon } from "@tabler/icons-react";

export function SiteHeader() {
  const [notifications] = useAtom(notificationsAtom);

  return (
    <header
      style={{
        position: "fixed",
        top: "0",
        zIndex: "999",
        backgroundColor: "#070c14",
        width: "-webkit-fill-available",
      }}
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between">
        <div className="flex">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <img src="/314.png" className="mr-5" alt="logo-small" />
          <h1 className="text-base font-medium"></h1>
        </div>
        <div className="mr-2 cursor-pointer">
          <Link to="/notifications">
            <div className="relative w-fit">
              <BellIcon className="size-5" />
              <Badge className="absolute -end-3.5 -top-2 h-5 min-w-5 rounded-full px-1 tabular-nums">
                {notifications.length}
              </Badge>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
