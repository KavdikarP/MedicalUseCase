import { Link, useLocation } from "react-router-dom";
// import prudentialLogo from "../assets/prudential.jpeg";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import cymbalLogo from "../assets/cymbal.png";

const routes = [
  {
    route: "/analyse-medical-report",
    displayText: "Analyse Medical Report",
  },
  {
    route: "/analyse-prescription",
    displayText: "Analyse Prescription",
  },
  {
    route: "/claim-approval",
    displayText: "Claim Approval",
  },
//  {
//    route: "/glossary",
//    displayText: "Medical Glossary",
//  },
];

const secondaryRoutes = [
  {
    route: "/documentation",
    displayText: "Demo Objective",
    icon: TextSnippetIcon,
  },
  // {
  //   route: "/settings",
  //   displayText: "Settings",
  //   icon: SettingsIcon
  // },
];

const SideBar = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-16">
        <div className="w-64">
          <img src={cymbalLogo} style={{ width: "200px" }} alt="" />
        </div>
        <div className="flex flex-col gap-2 w-fit">
          {routes.map((route, i) => {
            return (
              <Link to={route.route} key={i}>
                <div className={`py-2 px-4 rounded-md ${pathname === route.route ? "bg-gray-200" : ""}`}>
                  {route.displayText}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2 w-fit border-t-2 py-2">
        {secondaryRoutes.map((route, i) => {
          const Icon = route.icon;
          return (
            <Link to={route.route} key={i}>
              <div
                className={`flex items-center gap-2 py-2 px-4 rounded-md ${
                  pathname === route.route ? "bg-gray-200" : ""
                }`}
              >
                {Icon && <Icon fontSize="small" />}
                {route.displayText}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;
