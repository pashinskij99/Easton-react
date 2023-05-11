import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

function FaqAccord(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (props.count === -1) {
      setCount(FAQ_ITEMS.length);
    } else {
      setCount(props.count);
    }
  });

  return (
    <div className="w-full p-3 pt-3 pb-8 bg-blue-100 rounded-xl">
      <Accordion /*defaultIndex={[0]}*/ allowMultiple>
        {FAQ_ITEMS.slice(0, count).map((item) => {
          if (item.content) {
            return (
              <AccordionItem
                boxShadow={0}
                outline={0}
                bg="white"
                mb={"2"}
                border="0"
                rounded="9"
                ml="6"
                mr="6"
              >
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <p className="p-3 font-semibold"> {item.label} </p>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} ml="3">
                  <p className="pb-2">
                    {item.content.split("\n").map((content) => (
                      <>
                        <p>{content}</p>
                        <br></br>
                      </>
                    ))}
                  </p>
                  {item.list.map((l) => (
                    <li className="pl-4 font-light"> {l} </li>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            );
          } else {
            return (
              <div className="pt-3 pb-3 mb-2 ml-6 mr-6 text-xl font-bold text-center text-gray-600 bg-transparent">
                {" "}
                {item.label}{" "}
              </div>
            );
          }
        })}
      </Accordion>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    label: "Car loan eligibility requirements and conditions",
  },
  {
    label: "What types of car loans do you offer?",
    content: "Easton Financial (“Easton”) offers a variety of auto loan types:",
    list: [
      "Dealer purchases (when you purchase a new or used car at a dealership)",
      "Refinancing of current auto loans",
      "Private party (when you purchase a vehicle from another individual). You can apply for a private party loan by visiting a financial center.",
    ],
  },
  {
    label: "Are there any types of vehicles Easton does not finance?",
    content: "Yes. The following vehicles are not eligible for financing:",
    list: [
      "Vehicles older than 15 calendar years",
      "Vehicles with 125,000 miles or more",
      "Vehicles valued at less than $6,000 (based on franchise dealer invoice for new vehicles or the wholesale value from an official used car value guide such as NADAguides for used vehicles)",
      "Vehicles used for commercial and/or business purposes (yet… we hope to offer this product at a later date)",
      "Salvaged or branded-title vehicles",
      "Gray market or lemon law vehicles",
    ],
  },
  {
    label: "Who is eligible to apply for an auto loan?",
    content:
      "You must be 18 years old or otherwise have the ability to legally contract for automotive financing in your state of residence, and either a U.S. citizen or resident alien (permanent or non-permanent).",
    list: [],
  },
  {
    label: "Do you offer car loans in all 50 states?",
    content: "Not yet. Currently, Easton lends in the following states:",
    list: [
      "AZ",
      "CA",
      "CO",
      "FL",
      "GA",
      "IL",
      "IN",
      "KS",
      "KY",
      "MD",
      "MI",
      "MN",
      "MO",
      "NC",
      "OH",
      "OR",
      "PA",
      "SC",
      "TN",
      "TX",
      "UT",
      "VA",
      "WI",
    ],
  },
  {
    label:
      "Are there any specific terms and conditions I should be aware of before applying for an auto loan?",
    content:
      "Specific terms for your auto loan are determined by a variety of factors, but you should be aware of the following:",
    list: [
      "Term limitations may apply",
      "Minimum and Maximum loan amounts may apply",
      "Loan-to-value restrictions apply",
      "A down payment may be required",
      "Title and state fees may apply",
    ],
  },
  {
    label:
      "If I decide to pay my auto loan off early, is there a prepayment penalty?",
    content: "No.",
    list: [],
  },
  {
    label: "Applying for a car loan",
  },
  {
    label: "How do I apply for an auto loan?",
    content:
      "You can apply for your auto loan online in just a few minutes. There's no fee to apply and most decisions are available in just 60 seconds. In cases where applications require a more detailed review, we'll send you an email when the decision is ready.",
    list: [],
  },
  {
    label: "Does Easton charge a fee to apply for an auto loan?",
    content: "No. Easton does not charge you an auto loan application fee.",
    list: [],
  },
  {
    label: "Will applying for a loan or refinance affect my credit?",
    content:
      "No. Easton uses a “soft pull” of credit during the application process which has no impact on your credit.",
    list: [],
  },
  {
    label:
      "What type of information do you collect when I apply for an auto loan?",
    content:
      "When you apply for an auto loan with Easton, you'll be asked to provide personal information such as your name, address, Social Security number, employment information, income, U.S. citizenship status and email address. \n Depending on the specifics of your loan request, the following documents may be required prior to closing: purchase agreement/bill of sale, registration, title, lease buyout instructions, proof of income, federal tax returns, W-2s and financial statements. \n For refinance loans and lease buyouts, we require specific vehicle information such as make, model, year, mileage and vehicle identification number (VIN).",
    list: [],
  },
  {
    label: "What should I do if I've frozen my credit?",
    content:
      "If you have frozen your credit report due to security concerns, you will need to temporarily unfreeze with all three credit bureaus (Equifax, TransUnion and Experian) to proceed with an auto application. Please refer to the instructions provided when you froze your report or contact the individual bureaus for more information.",
    list: [],
  },
  {
    label: "How do I access a saved loan application?",
    content: "You can access your saved application for 30 days.",
    list: [],
  },
  {
    label:
      "How soon will I know if my auto loan application has been approved?",
    content:
      "Most decisions are available in about 60 seconds. In cases where applications require a more detailed review, we'll send you an email when the decision is ready.",
    list: [],
  },
  {
    label: "If I'm approved, how long is my loan offer good for?",
    content:
      "Your loan approval and interest rate are locked in for 30 calendar days from the date of your original loan submission.",
    list: [],
  },
  {
    label: "How do I check the status of my auto loan application?",
    content:
      "You can securely check the status of your car loan application anytime. We will also send you an email when a decision about your application has been made.",
    list: [],
  },
  {
    label: "Purchasing a car",
  },
  {
    label: "Refinancing an existing car loan",
  },
  {
    label: "What are the benefits of refinancing?",
    content:
      "Refinancing your existing auto loan may offer you 1 of 2 potential benefits. First, refinancing may reduce your monthly payment through lowering your interest rate, extending your loan term, or both. Or, refinancing may help you to reduce the overall amount of interest paid.",
    list: [],
  },
  {
    label: "Can I refinance my existing auto loan through Easton?",
    content:
      "Yes, and you can refinance your existing auto loan whether it's through Easton or another financial institution.",
    list: [],
  },
  {
    label: "What information do you need about my vehicle?",
    content:
      "When checking your rate, we’ll need either your VIN, license plate number or make/model/trim of your vehicle. This is because we’ll use the value of your vehicle to provide you with the best options.",
    list: [],
  },
  {
    label: "Managing your car loan",
  },
  {
    label: "I closed on my loan with Easton; what happens next?",
    content:
      "Within 10-15 business days after your closing date, you'll receive a welcome package containing information about your account including your account number, the date your first payment is due and confirmation of your monthly payment amount",
    list: [],
  },
  {
    label: "When will I receive the first monthly statement for my auto loan?",
    content:
      "Your paper statement is mailed each month 20 days prior to your due date, unless you decide to set up automatic payments through Online Bill Pay, in which case you won't receive monthly paper statements. With Online Bill Pay, you can schedule recurring or one-time bill payments from your checking or money market accounts.  You can also sign up for electronic bills by signing in to Online Banking and selecting eBills from the Bill Pay navigation menu.  Sign in to set up Bill Pay payments ",
    list: [],
  },
  {
    label: "Where can I find my loan statements?",
    content:
      "We will email you statements every month. In addition, you can see current and past statements online here.",
    list: [],
  },
  {
    label: "How can I sign up for automatic payments to my auto loan?",
    content:
      "The loan closing documents will include a form allowing for automatic payments. This authorizes Easton to debit your banking account for the monthly payment automatically through ACH. You won’t need to do anything!",
    list: [],
  },
  {
    label: "How do I email Easton with a question about my auto loan?",
    content: "Select the Contact link from the navigation menu.",
    list: [],
  },
  {
    label:
      "Once I pay off my loan in full, how long will it take for me to receive proof that the loan is closed and get my title?",
    content:
      "In most situations you can expect to receive your lien release, paid-in-full letter and title (if the title is available) within 7-10 business days after we receive and process your payoff. If the title is electronic or other conditions apply, our letter will detail the process to obtain the title and ensure that the lien release is properly recorded.  ",
    list: [],
  },
];

// TODO: figure out styling and links

export default FaqAccord;
