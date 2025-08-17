import {
  IconCirclePlusFilled,
  IconAddressBook,
  type Icon,
} from "@tabler/icons-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="mb-4">
          <SidebarMenuItem className="flex items-center gap-2">
            <ToastContainer
              position="bottom-center"
              autoClose={2000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable={false}
              pauseOnHover
              theme="dark"
            />
            <SidebarMenuButton
              tooltip="Quick Create"
              style={{ background: "#d13c09", color: "white" }}
              className="min-w-8 duration-200 ease-linear">
              <IconCirclePlusFilled />
              <span>Send to a friend</span>
            </SidebarMenuButton>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/address-book">
                  <Button
                    size="icon"
                    className="size-8 group-data-[collapsible=icon]:opacity-0 cursor-pointer"
                    variant="outline">
                    <IconAddressBook />
                    <span className="sr-only">Contacts</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>My Contacts</p>
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <Link to={item.url}>
                <SidebarMenuButton
                  tooltip={item.name}
                  className="cursor-pointer">
                  {item.icon && <item.icon />}
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
