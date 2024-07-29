import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  DocumentIcon,
  FilmIcon,
  FingerPrintIcon,
  PrinterIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications, PDF, Films, Cookie, TaskLog } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <DocumentIcon {...icon} />,
        name: "PDF",
        path: "/pdf",
        element: <PDF />,
      },
      {
        icon: <FilmIcon {...icon} />,
        name: "Films",
        path: "/films",
        element: <Films />,
      },
      {
        icon: <FingerPrintIcon {...icon} />,
        name: "Cookie",
        path: "/cookie",
        element: <Cookie />,
      },
      {
        icon: <PrinterIcon {...icon} />,
        name: "Task Logs",
        path: "/task-logs",
        element: <TaskLog />,
      },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: "profile",
      //   path: "/profile",
      //   element: <Profile />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "tables",
      //   path: "/tables",
      //   element: <Tables />,
      // },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
