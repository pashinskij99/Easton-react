//import { useState } from "react";
//import { useDispatch, useSelector } from "react-redux";


export const borrowerData = [
  {
      label: "Name",
      value: "",
  },
    {
      label: "DOB",
      value: "",
    },
    {
      label: "Age",
      value: 0,
    },
    {
      label: "SSN",
      value: "",
    },
    {
      label: "State",
      value: "",
    },
    {
      label: "ZipCode",
      value: "",
    },
    {
      label: "Own_Rent",
      value: "",
    },
    {
      label: "RentMtge",
      value: 0,
    },
    {
      label: "Employer",
      value: "",
    },
    {
    label: "Occupation",
    value: "",
  },
  {
    label: "Income",
    value: 0,
  },
  {
    label: "OtherIncome",
    value: 0,
  },
  {
    label: "OtherSources",
    value: "",
  },
  {
    label: "Total_Income",
    value: 0,
  },
  {
    label: "CreditScore",
    value: 0,
  },
  {
    label: "Inquiries",
    value: "",
  },
  {
    label: "Recent",
      value: "",
    },
    { 
    label: "Tradelines",
    value: "",
      },
  {
    label: "Debt",
    value: 0,
    },
  ];

export const coborrowerData = [
  {
    label: "Relation",
    value: "",
    isBold: true,
  },
  {
      label: "Name",
      value: "",
  },
    {
      label: "DOB",
      value: "",
    },
    {
      label: "Age",
      value: 0,
    },
    {
      label: "SSN",
      value: "",
    },
    {
      label: "State",
      value: "",
    },
    {
      label: "ZipCode",
      value: "",
    },
    {
      label: "Own_Rent",
      value: "",
    },
    {
      label: "RentMtge",
      value: 0,
    },
    {
      label: "Employer",
      value: "",
    },
    {
    label: "Occupation",
    value: "",
  },
  {
    label: "Income",
    value: 0,
  },
  {
    label: "OtherIncome",
    value: 0,
  },
  {
    label: "OtherSources",
    value: "",
  },
  {
    label: "Total_Income",
    value: 0,
  },
  {
    label: "CreditScore",
    value: 0,
  },
  {
    label: "Inquiries",
    value: "",
  },
  {
    label: "Recent",
      value: "",
    },
    { 
    label: "Tradelines",
    value: "",
      },
  {
    label: "Debt",
    value: 0,
    },
  ];
  
  export const incomeData = [

    {
      label: "Total Income",
      borrower: "",
      co: "",
      comb: 0,
    },
    {
      label: "Housing",
      borrower: "",
      co: "",
      comb: 0,
    },
    {
    label: "Debt",
    borrower: "",
    co: "",
    comb: 0,
  },
  {
    label: "",
    borrower: "Borrower",
    co: "Co",
    comb: "Comb",
  },
  {
    label: "DispIncome",
    borrower: "",
    co: "",
    comb: "",
  },
  {
    label: "CurrDTI",
    borrower: "",
    co: "",
    comb: "",
  },
  {
    label: "CurrPTI",
    borrower: "",
    co: "",
    comb: "",
  },
];

export var vehicleData = [
    {label: "appname_time",value: "",},
    {label: "submission_id",value: "",},
    {label: "vin",value: "",},
    {label: "make",value: "",},
    {label: "model",value: "",},
    {label: "trim",value: "",},
    {label: "year",value: 0,},
    {label: "age",value: 0,},
    {label: "zip",value: "",},
    {label: "chassis_dlr",value: 0,},
    {label: "conv_dlr",value: 0,},
    {label: "qstraints_ties_dlr",value: 0,},
    {label: "transeat_dlr",value: 0,},
    {label: "total_dlr",value: 0,},
    {label: "chassis_east",value: 0,},
    {label: "conv_east",value: 0,},
    {label: "qstraints_ties_east",value: 0,},
    {label: "transeat_east",value: 0,},
    {label: "total_east",value: 0,},
    {label: "ltv_dlr",value: 0,},
    {label: "ltv_east",value: 0,},
    {label: "conv_manu",value: "",},
    {label: "conv_modeltype",value: "",},
    {label: "conv_rearside",value: "",},
    {label: "conv_auto",value: "",},
    {label: "conv_newused",value: "",},
    {label: "vehprice_retail",value: 0,},
    {label: "vehprice_privparty",value: 0,},
    {label: "vehprice_trade",value: 0,},
    {label: "mileage",value: 0,},
    {label: "vehprice_mileage",value: 0,},
    {label: "valuation_date",value: "",},
    {label: "contract_id",value: "",},
  ];

export const contractData = [
  {
    label: "Total Cash Price",
    value: 0,
    color: "blue",
    editable: true,
  },
  {
    label: "",
    value: "",
  },
  {
    label: "Down Payment",
    value: 0.00,
    editable: true,
  },
  {
    label: "Dealer Fees",
    value: 0.00,
    editable: true,
  },
  {
    label: "Rebate",
    value: 0.00,
    editable: true,
  },
  {
    label: "LicenseRegTags",
    value: 0.00,
    editable: true,
  },
  {
    label: "Trade In Allowance",
    value: 0.00,
    editable: true,
  },
  {
    label: "Other Taxable",
    value: 0.00,
    editable: true,
  },
  {
    label: "Payoff On Trade",
    value: 0.00,
    editable: true,
  },
  {
    label: "Other NonTaxable",
    value: 0.00,
    editable: true,
  },
  {
    label: "Service Cont Amount",
    value: 0.00,
    editable: true,
  },
  {
    label: "Gap Product Amount",
    value: 0.00,
    editable: true,
  },
  {
    label: "Lender Titling Fee",
    value: 0.00,
    editable: true,
  },
  {
    label: "Lender Credit Fee",
    value: 0.00,
    editable: true,
  },
  {
    label: "Lender Processing Fee",
    value: 0.00,
    editable: true,
  },
  {
    label: "Florida Stamp Tax",
    value: 0.00,
    editable: true,
  },
  {
    label: "Other Taxes",
    value: 0.00,
    editable: true,
  },
  {
    label: "Sales Tax",
    value: 0.00,
    editable: true,
  },
  {
    label: "",
    value: "",
  },
  {
    label: "Amount to Finance",
    value: 0.00,
  },
];

export const rategridData = [
  {
      "RateLTV" : "",
      "LTVOverride": true,
      "Score": "",
      "ScoreOverride": "",
      "Loan Size":"",
      "Downpayment":"",
      "DateTime":"",
      "rategridtable" : [
			{
				"term": 36,
				"rate": "",
				"pti": "",
				"adjustment": "",
				"showhide": ""
			},
			{
				"term": 48,
				"rate": "",
				"pti": "",
				"adjustment": "",
				"showhide": ""
			},
			{
				"term": 60,
				"rate": "",
				"pti": "",
				"adjustment": "",
				"showhide": ""
			},
			{
				"term": 72,
				"rate": "",
				"pti": "",
				"adjustment": "",
				"showhide": ""
			},
			{
				"term": 84,
				"rate": "",
				"pti": "",
				"adjustment": "",
				"showhide": ""
			},
			{
				"term": 96,
				"rate": "",
				"pti": "",
				"adjustment": "",
				"showhide": ""
			},
			{
				"term": 108,
				"rate": "",
				"pti": "",
				"adjustment": "",
				"showhide": ""
			},
			{
				"term": 120,
				"rate": "",
				"pti": "",
				"adjustment": "",
				"showhide": ""
			},
    ],
    }
  ];

export const termsData = [
  {
    label: "Contract Rate",
    value: "",
  },
  {
    label: "Term",
    value: "",
  },
  {
    label: "Contract Date",
    value: "",
  },
  {
    label: "First Pmt Date",
    value: "",
  },
  {
    label: "Final Due Date",
    value: "",
  },
  {
    label: "Payment",
    value: "",
  },
];

//vehicleData.tableData.forEach((item) => {
//  const dealerPrice = parseFloat(item.dealer.replace(/[^0-9.-]+/g,""));
//  const eastonPrice = parseFloat(item.easton.replace(/[^0-9.-]+/g,""));
//  const diff =dealerPrice - eastonPrice ;
//  item.diff = `$${diff.toLocaleString()}`; // update the diff property with the calculated difference});