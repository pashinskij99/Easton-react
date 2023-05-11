import { Link } from "@chakra-ui/react";
import FaqAccord from "../components/FaqAccord";

// TODO when you squash it it looks lik there's more left padding than right padding

function FAQ() {
  return (
    <div className="mt-10">
      <p className="mb-10 ml-2 mr-2 text-3xl font-extrabold text-center text-gray-700">
        Easton FAQs! Need Help? <br></br>
        <span className="text-xl font-normal text-blue-400">
          {" "}
          We've got you.{" "}
        </span>
      </p>
      <div className="flex flex-col items-center">
        <div className="w-full pl-3 pr-3 md:pr-8 md:pl-8 max-w-7xl">
          <FaqAccord count={-1} />
          <div className="content-center mt-5 text-center">
            <Link className="" variant={"link"} href={"contact"}>
              {" "}
              Still have questions?{" "}
              <span className="font-bold text-blue-400">Contact us!</span>{" "}
            </Link>
          </div>
          <div className="z-0 h-56 border-0 border-red-200">&nbsp;</div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
