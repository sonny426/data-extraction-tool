import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { getUser } from "@/hooks/user.actions";
import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import { Modal, notification } from 'antd';
import { useNavigate } from "react-router-dom";
export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const [data, setData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const [modalVisible, setModalVisible] = useState(false);
  const user = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    setData({
      old_password: "",
      new_password: "",
      confirm_password: "",
    })
  }, [modalVisible])

  const handleUpdatePassword = () => {
    if (data.new_password !== data.confirm_password) {
      notification["error"]({
        description: "Please input the correct password."
      });
    }
    axiosInstance.put(`/auth/password/${user.id}/`, data)
      .then(res => {
        notification["success"]({
          description: JSON.stringify(res.data.detail),
        })
        setModalVisible(false);
      })
      .catch(err => {
        notification["error"]({
          description: JSON.stringify(err.response.data)
        })
      })
  }

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar
        ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
        : "px-0 py-1"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""
              }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100 uppercase"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal uppercase"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray" className="uppercase">
            {page}
          </Typography>
        </div>
        <div className="flex">
          <div className="flex items-center mx-3 cursor-pointer" onClick={() => setModalVisible(prev => !prev)}>
            <UserCircleIcon className="h-10 w-10 text-blue-gray-500 mr-2" />
            <label style={{ color: "black", cursor: "pointer" }}>
              {user.first_name}
            </label>
          </div>
          <div className="flex items-center mx-3 cursor-pointer" onClick={() => {
            localStorage.removeItem("auth");
            navigate("/login");
          }}>
            <ArrowRightOnRectangleIcon className="h-10 w-10 text-blue-gray-500 mr-2" />
            <label style={{ color: "black", cursor: "pointer" }}>
              Logout
            </label>
          </div>
        </div>
        <Modal title="Change Password" open={modalVisible} onOk={handleUpdatePassword} onCancel={() => setModalVisible(false)}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Old Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={data.old_password}
              onChange={e => setData({ ...data, old_password: e.target.value })}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              New Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={data.new_password}
              onChange={e => setData({ ...data, new_password: e.target.value })}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Confirm Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={data.confirm_password}
              onChange={e => setData({ ...data, confirm_password: e.target.value })}
            />
          </div>
        </Modal>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
