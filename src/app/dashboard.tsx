import { useEffect } from "react";
import { SectionCards } from "@/components/section-cards";

import { useAtom } from "jotai";
import { notificationsAtom } from "@/store/notfications";
import { getByType } from "@/api/connections";

import { useNavigate } from "react-router-dom";

export default function Page() {
  const [, setNotifications] = useAtom(notificationsAtom);

  const navigate = useNavigate();

  useEffect(() => {
    getByType("notifications", navigate)
      .then((list) => {
        setNotifications(list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setNotifications, navigate]);

  return (
    <div className="flex flex-1 flex-col @container">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
          <SectionCards />
          {/* <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div> */}
          <div />
        </div>
      </div>
    </div>
  );
}
