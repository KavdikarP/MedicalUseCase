import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar } from "@mui/material";
import { useContext } from "react";
import { GlobalContext } from "../context";

const PageHeader = ({ title }: { title: string }) => {
//  const { user, signOut } = useContext(GlobalContext);

  return (
    <div className="flex flex-row">
      <p className="text-4xl font-bold">{title}</p>
      <div className="ml-auto h-full">
      {/*<div className="flex flex-row gap-4 text-gray-500 items-center">
          <div onClick={() => signOut()} className="cursor-pointer">
            <LogoutIcon></LogoutIcon>
          </div>
          <Avatar src={user!.photo_url}></Avatar>
        </div> */}
      </div>
    </div>
  );
};

export default PageHeader;
