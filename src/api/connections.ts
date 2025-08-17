import type { NavigateFunction } from "react-router-dom";
import config from "@/config";

const API_URL = config.API_URL;

export const getByType = async (type: string, navigate: NavigateFunction) => {
  try {
    const token = await localStorage.getItem("token");
    console.log("token:", token);

    const response = await fetch(`${API_URL}/api/v1/${type}/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      //todo: borrar todo el contenido de los atoms
      //logoutUser(); // clear token, reset state

      localStorage.removeItem("token");
      navigate("/login");
      return [];
    }

    const result = await response.json();

    console.log("result:", result);

    if (!result || !result.success || !result[type]) {
      console.log("Failed to fetch", type);
      return [];
    }
    return result[type];
    //setNotifications(result.notifications);
  } catch (error) {
    console.log("Error fetching notifications:", error);
    return [];
  }
};
