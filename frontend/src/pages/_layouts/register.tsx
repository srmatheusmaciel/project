import { HeaderLogin } from "@/components/headerLogin";
import { Outlet } from "react-router-dom";

export function RegisterLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-blue-200 to-blue-800 overflow-hidden">
      <HeaderLogin />
      <Outlet />
    </div>
  )
}