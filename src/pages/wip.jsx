import React from "react";
import { Link } from "@chakra-ui/react";
import "./home.css";
import WipIcon from "../resources/wip.svg";

function WIP(props) {
  return (
    <div className="flex flex-col items-center content-center justify-center text-center text-gray-800 mt-14">
      <p className="text-5xl font-black md:text-6xl"> Being assembled.. </p>
      <span className="mt-5 text-xl font-medium text-blue-400">
        {" "}
        Sit tight!{" "}
      </span>
      <p className="mb-8 text-lg text-gray-700 mt-14"> For now, please </p>
      <Link
        href={"contact"}
        className="w-64 p-3 text-2xl font-black bg-green-400 rounded-lg shadow-2xl cta hover:bg-green-300 pl-14 pr-14 text-gray-50 "
        _hover={{
          textDecoration: "none",
        }}
      >
        Contact us
      </Link>
      <div className="pl-6 pr-6 mt-12">
        <img className="" src={WipIcon} alt="wip" />
      </div>
    </div>
  );
}

export default WIP;
