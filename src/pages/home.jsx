import React from "react";
import Car from "../resources/car.svg";
import Circles from "../resources/bgcircle.svg";
import "./home.css";
import { Link } from "@chakra-ui/react";
import BlueSep from "../resources/bluesep.svg";
import FaqAccord from "../components/FaqAccord";

function Home() {
  return (
    <div className="flex flex-col border-0 border-red-500">
      <div className="pt-4 md:pt-0 hero-wrapper md:hero-big">
        {/*<div className="clearfix">&nbsp; sss</div>*/}
        <div className="flex flex-col content-wrapper md:mt-48">
          <div
            className="text-5xl font-black text-gray-900 heads"
            //style={{fontFamily: "Roboto"}}
          >
            <span className="md:text-7xl md:mt-0">Mobility for</span>
            <div className="font-sans font-black text-green-500 text-7xl">
              {" "}
              everyone{" "}
            </div>
          </div>
          <div className="car">
            <img src={Car} alt="car" />
          </div>
          <Link
            href={"application"}
            className="z-20 p-3 mt-12 text-2xl font-black bg-green-400 rounded-lg shadow-2xl text-gray-50 hover:bg-green-300 cta pl-14 pr-14"
            _hover={{
              textDecoration: "none",
            }}
          >
            Get Started!
          </Link>
        </div>
        <div className="circles">
          <img className="rcirc" src={Circles} alt="circles" />
        </div>
      </div>
      <div className="z-30 flex flex-col items-center content-center justify-center mt-4 md:mt-20 pr-14 pl-14 md:flex-row md:space-x-16 justify-items-center">
        <div className="triple">
          <p className="text-blue-400 triple-header"> Accessibility </p>
          Our mission is to offer loans at competitive rates so that{" "}
          <span className="font-bold">everyone can afford</span> a wheelchair
          accessible vehicle.
        </div>

        <div className="triple">
          <p className="text-green-400 triple-header">Freedom </p>
          Easton Financial (“Easton”) is{" "}
          <span className="font-bold"> dedicated to help </span> bring the
          freedom that comes with mobility to those who have been left behind.
        </div>

        <div className="triple">
          <p className="text-pink-500 triple-header"> Technology </p>
          By applying a combination of technology and a personal touch, we{" "}
          <span className="font-bold">set ourselves apart</span> from the
          competition.
        </div>
      </div>
      <div className="flex items-center content-center justify-center pl-5 pr-5 mt-20 font-semibold text-center text-md">
        <p>
          20+ years of experience;{" "}
          <span className="font-extrabold text-green-400">
            {" "}
            reaching those overlooked{" "}
          </span>{" "}
          by other lenders
        </p>
      </div>
      <div className="flex flex-col items-center content-center justify-center">
        <div className="z-10">
          <img className="w-full sep " src={BlueSep} alt="seperator" />
        </div>
        {/*
		<div className="flex flex-col items-center justify-center mt-20 md:flex-row md:space-x-14 ">
		    <div className="z-10"><img className="col-img" src={Fin} alt="backdrop"/></div>
		    <Link
			href={'signup'}
			className="p-3 text-2xl font-black bg-green-400 rounded-lg shadow-2xl cta hover:bg-green-300 pl-14 pr-14 text-gray-50 "
			_hover={{
			    textDecoration: 'none',
			}}
		    >Finance</Link>

		</div>
		<div className="flex flex-col-reverse items-center justify-center mt-20 md:flex-row md:space-x-14 ">
		    <Link
			href={'wip'}
			className="p-3 pl-12 pr-12 text-2xl font-black bg-blue-400 rounded-lg shadow-2xl lg:ml-52 ctab hover:bg-blue-300 text-gray-50 "
			_hover={{
			    textDecoration: 'none',
			}}
		    >Refinance</Link>
		    <div className="z-10"><img className="col-img" src={ReFin} alt="backdrop"/></div>

		</div>
	    */}
      </div>
      <div className="mt-40">
        <p className="mb-10 ml-2 mr-2 text-3xl font-extrabold text-center text-gray-700">
          Easton FAQs! Need Help? <br></br>
          <span className="text-xl font-normal text-blue-400">
            {" "}
            We've got you.{" "}
          </span>
        </p>
        <div className="flex flex-col items-center">
          <div className="w-full pl-3 pr-3 md:pr-8 md:pl-8 max-w-7xl">
            <FaqAccord count={6} />
            <div className="content-center mt-5 text-center">
              <p>
                Still have questions?{" "}
                <Link className="" variant={"link"} href={"FAQ"}>
                  {" "}
                  <span className="font-bold text-blue-400">
                    Read more FAQs,
                  </span>{" "}
                </Link>{" "}
                <Link className="" variant={"link"} href={"contact"}>
                  {" "}
                  <span className="font-bold text-green-400">
                    {" "}
                    or contact us!
                  </span>{" "}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center w-4/5 pt-24 text-center pb-28 md:w-3/5 bg-gray-50 rounded-xl mt-28">
          <p className="mb-5 text-3xl font-black"> Ready to get started? </p>
          <p className="font-medium">
            Talk to your dealer today about a loan from Easton!
          </p>
          <Link
            href={"application"}
            _hover={{
              textDecoration: "none",
            }}
            className="fcta"
          >
            {" "}
            Let's do it.{" "}
          </Link>
        </div>
      </div>
      <div className="z-0 h-56 border-0 border-red-200">&nbsp;</div>
    </div>
  );
}

export default Home;
