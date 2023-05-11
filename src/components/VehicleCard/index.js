import {
  Icon,
  Box,
  Text,
  Button,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { FaList, FaSyncAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ContentModal from "../ContentModal";
import { vehicleData } from "../../mock";
import { getVehicleDetails } from "../../store/vehicle";
import axios from "axios";
import ConvDropdowns from "./ConvDropdowns";
import ReactTable2 from "./RCReactTable";
import "../ContractCard/index";
import { useQuery } from "react-query";

const currFormat = (val) => {
  if (typeof val !== "number") {
    val = Number(val);
  }
  if (isNaN(val) || val === null || val === undefined) {
    val = 0;
  }
  if (typeof val === "string" && val.charAt(0) === "$") {
    val = currParse(val);
  }
  val = parseFloat(val);
  return "$" + val.toLocaleString();
};

const currParse = (val) => {
  if (typeof val !== "string") {
    val = String(val);
  }
  val = val.replace(/[^0-9.]+/g, ""); // Remove all non-numeric characters
  const parsedVal = parseFloat(val);
  if (isNaN(parsedVal)) {
    return 0;
  }
  return parsedVal;
};

const percentFormat = (val) =>
  val.toLocaleString(undefined, { maximumFractionDigits: 4 }) + "%";
const percentParse = (val) => {
  if (typeof val !== "string") {
    val = String(val);
  }
  return val.replace(/\%/, "");
};

export const fetchVehDB = async (vehicleInfo) => {
  try {
    const response = await fetch("http://eastontj.ddns.net:7000/VehDB/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicleInfo),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
  }
};

export const fetchVehApp = async (submission_id) => {
  try {
    const response = await fetch(
      `http://eastontj.ddns.net:7000/VehAppDB/${submission_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
  }
};

export const fetchVehRaw = async (vinValue) => {
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vinValue}?format=json`
    );
    const data = await response.json();
    return data.Results[0];
  } catch (error) {
    console.error("Error fetching vehicle data:", error);
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const VehicleCard = ({ updateTotalCashPrice }) => {
  const dispatch = useDispatch();
  const borrowerStore = useSelector((state) => state.borrower);
  const [isOpen, setIsOpen] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  const borrowerInfo = borrowerStore.all[0]?.borrower;
  const contractInfo = borrowerStore.all[2]?.contract;
  var vehicleInfo = borrowerStore.all[3]?.vehicle;

  const [tableData, setTableData] = useState(vehicleData.tableData);
  const [gridData, setGridData] = useState(vehicleData.gridData);
  const [isLoading, setIsLoading] = useState(false);

  var [vinValue, setVinValue] = useState(vehicleInfo?.vin);
  var [mileageValue, setMileageValue] = useState(vehicleInfo?.mileage);
  var [makeValue, setMakeValue] = useState(vehicleInfo?.make);
  var [modelValue, setModelValue] = useState(vehicleInfo?.model);
  var [modelYearValue, setModelYearValue] = useState(vehicleInfo?.modelyear);
  var [trimValue, setTrimValue] = useState(vehicleInfo?.trim);
  const [vin, setVin] = useState("");
  const [isNewChassis, setIsNewChassis] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingVal, setIsUpdatingVal] = useState(false);
  const [isSide, setIsSide] = useState("");
  const [isMotorized, setIsMotorized] = useState("");
  const [isInFloor, setIsInFloor] = useState("");
  const [dealerConv, setDealerConv] = useState("");
  const [dealerOptions, setDealerOptions] = useState(0);
  const [dealerChassis, setDealerChassis] = useState("");
  const [eastonConv, setEastonConv] = useState("");
  const [eastonChassis, setEastonChassis] = useState("");
  const [eastonOptions, setEastonOptions] = useState(0);

  const isNewConvRef = useRef();
  const isNewChassisRef = useRef();
  const isSideRef = useRef();
  const isMotorizedRef = useRef();
  const isInFloorRef = useRef();
  const dealerConvRef = useRef();
  const dealerOptionsRef = useRef();
  const dealerChassisRef = useRef();
  const dealerTotalRef = useRef();
  const eastonConvRef = useRef();
  const eastonChassisRef = useRef();
  const eastonOptionsRef = useRef();
  const eastonTotalRef = useRef();

  const [vehicleDBtableData, setVehicleDBtableData] = useState([]);
  const memoizedVehicleInfo = useMemo(() => vehicleInfo, [vehicleInfo]);
  const [selectedConvManu, setSelectedConvManu] = useState("");
  const storedApplication = JSON.parse(localStorage.getItem("ApplicationLS"));
  const submission_id = storedApplication?.submission_id;
  const appname_time = storedApplication?.appname_time;

  const getValuation = async (vin, zip) => {
    try {
      setIsUpdatingVal(true);
      const response = await fetch(
        `http://eastontj.ddns.net:7000/pup/${zip}/${vin}`
      );
      const data = await response.json();
      setIsUpdatingVal(false);
      return data;
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  useEffect(() => {
    // Watch for changes in the page and reset values
    setResetValues(true);
    if (borrowerStore) {
      setVinValue(vehicleInfo?.vin);
      setMileageValue(vehicleInfo?.mileage);
      setMakeValue(vehicleInfo?.make);
      setModelValue(vehicleInfo?.model);
      setTrimValue(vehicleInfo?.trim);
      setModelYearValue(vehicleInfo?.modelyear);
    }
  }, [borrowerStore]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (event) => {
    if (preventFormSubmit) {
      event.preventDefault();
      return;
    }
    var isSideSend = "";
    var isMotorizedSend = "";
    var isNewConvSend = "";
    var isNewChassisSend = "";
    var isInFloorSend = "";
    const date = new Date();
    const valdate = formatDate(date);

    if ((isSideRef.current.value = "")) {
      isSideSend = "rear";
    } else isSideSend = "side";
    if ((isMotorizedRef.current.value = "")) {
      isMotorizedSend = "manual";
    } else isMotorizedSend = "auto";
    if ((isNewConvRef.current.value = "")) {
      isNewConvSend = "used";
    } else isNewConvSend = "new";
    if ((isNewChassisRef.current.value = "")) {
      isNewChassisSend = "used";
    } else isNewChassisSend = "new";
    if ((isInFloorRef.current.value = "")) {
      isInFloorSend = "infloor";
    } else isInFloorSend = "foldout";

    if (chassisPrivpartyValue === "undefined") {
      chassisPrivpartyValue = "null";
    }
    if (chassisRetailValue === "undefined") {
      chassisRetailValue = "null";
    }
    if (chassisTradeinValue === "undefined") {
      chassisTradeinValue = "null";
    }
    if (mileageValuationValue === "undefined") {
      mileageValuationValue = "null";
    }

    const newTotalCashPrice = currParse(dealerTotalRef.current.value);
    updateTotalCashPrice = newTotalCashPrice;

    const storedVehicleDataString = localStorage.getItem("VehicleLS");

    if (storedVehicleDataString) {
      const storedVehicleData = JSON.parse(storedVehicleDataString);
      console.log("stored LS : ", storedVehicleData);
      storedVehicleData.vehicleInfoTD[0].dealerValue = currParse(
        dealerChassisRef.current.value
      );
      storedVehicleData.vehicleInfoTD[1].dealerValue = currParse(
        dealerConvRef.current.value
      );
      storedVehicleData.vehicleInfoTD[2].dealerValue = currParse(
        dealerOptionsRef.current.value
      );
      storedVehicleData.vehicleInfoTD[3].dealerValue = currParse(
        dealerTotalRef.current.value
      );
      storedVehicleData.vehicleInfoTD[0].eastonValue = currParse(
        eastonChassisRef.current.value
      );
      storedVehicleData.vehicleInfoTD[1].eastonValue = currParse(
        eastonConvRef.current.value
      );
      storedVehicleData.vehicleInfoTD[2].eastonValue = currParse(
        eastonOptionsRef.current.value
      );
      storedVehicleData.vehicleInfoTD[3].eastonValue = currParse(
        eastonTotalRef.current.value
      );

      // Stringify the updated object back to a JSON string
      const updatedVehicleDataString = JSON.stringify(storedVehicleData);

      // Save the updated JSON string to local storage
      localStorage.setItem("VehicleLS", updatedVehicleDataString);
    } else {
      // Handle the case where there is no data stored
      console.log("No vehicle data found in local storage");
    }

    var vehicleData = {
      action_type: "upVehicle",
      submission_id: submission_id,
      appname_time: appname_time,
      vin: vinValue,
      make: vehicleInfo?.make,
      model: vehicleInfo?.model,
      trim: vehicleInfo?.trim,
      year: vehicleInfo?.modelyear,
      age: null,
      zip: borrowerInfo.zip,
      chassis_dlr: currParse(dealerChassisRef.current.value),
      conv_dlr: currParse(dealerConvRef.current.value),
      qstraints_ties_dlr: null, //currParse(qstraints_ties_dlr),
      transeat_dlr: null, //currParse(transeat_dlr),
      total_dlr: currParse(dealerTotalRef.current.value),
      chassis_east: currParse(eastonChassisRef.current.value),
      conv_east: currParse(eastonConvRef.current.value),
      qstraints_ties_east: null, //currParse(qstraints_ties_eastRef.current.value),
      transeat_east: null, //currParse(transeat_eastRef.current.value),
      total_east: currParse(eastonTotalRef.current.value),
      ltv_dlr:
        currParse(contractInfo?.amounttofinance) /
        currParse(dealerTotalRef.current.value),
      ltv_east:
        currParse(contractInfo?.amounttofinance) /
        currParse(eastonTotalRef.current.value),
      conv_manu: "", //ConvManuRef.current.value,
      conv_modeltype: "", //ConvModelRef.current.value || '',
      conv_rearside: isSideSend,
      conv_auto: isMotorizedSend,
      conv_newused: isNewConvSend,
      chassis_newused: isNewConvSend,
      conv_infloor: isInFloorSend,
      vehprice_retail: currParse(chassisRetailValue),
      vehprice_privparty: currParse(chassisPrivpartyValue),
      vehprice_trade: currParse(chassisTradeinValue),
      mileage: mileageValue,
      vehprice_mileage: null, //mileageValuationValue,//vehprice_mileageRef.current.value,
      valuation_date: valdate,
      //      "contract_id":contract_id,
    };

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://eastontj.ddns.net:7000/LOSupdate",
        vehicleData
      );
      if (response.status === 200) {
        setIsSubmitting(false);
        setIsOpen(false);
        setVehicleInfoTD([
          {
            field: "Chassis",
            dealerValue: currFormat(vehicleData.chassis_dlr),
            eastonValue: currFormat(vehicleData.chassis_east),
            diff: currFormat(
              parseFloat(vehicleData.chassis_dlr || 0) -
                (vehicleData.chassis_east || 0)
            ),
          },
          {
            field: "Conversion",
            dealerValue: currFormat(vehicleData.conv_dlr),
            eastonValue: currFormat(vehicleData.conv_east),
            diff: currFormat(
              parseFloat(vehicleData.conv_dlr || 0) -
                (vehicleData.conv_east || 0)
            ),
          },
          {
            field: "Options",
            dealerValue: currFormat(dealerOptionsRef.current.value),
            eastonValue: currFormat(eastonOptionsRef.current.value),
            diff: currFormat(
              parseFloat(dealerOptionsRef.current.value || 0) -
                (eastonOptionsRef.current.value || 0)
            ),
          },
          {
            field: "Total",
            dealerValue: currFormat(
              (parseFloat(vehicleData.chassis_dlr) || 0) +
                (parseFloat(vehicleData.conv_dlr) || 0) +
                (parseFloat(dealerOptionsRef.current.value) || 0)
            ),
            eastonValue: currFormat(
              (parseFloat(vehicleData.chassis_east) || 0) +
                (parseFloat(vehicleData.conv_east) || 0) +
                (parseFloat(eastonOptionsRef.current.value) || 0)
            ),
            diff: currFormat(
              (parseFloat(vehicleData.chassis_dlr) ||
                0 + parseFloat(vehicleData.conv_dlr) ||
                0 + parseFloat(dealerOptionsRef.current.value) ||
                0) -
                (parseFloat(vehicleData.chassis_east) ||
                  0 + parseFloat(vehicleData.conv_east) ||
                  0 + parseFloat(eastonOptionsRef.current.value) ||
                  0)
            ),
          },
          {
            field: "LTV",
            dealerValue:
              (
                currParse(
                  contractInfo?.amounttofinance /
                    ((currParse(vehicleData.chassis_dlr) || 0) +
                      currParse(vehicleData.conv_dlr || 0) +
                      currParse(dealerOptionsRef.current.value) || 0)
                ) * 100
              ).toFixed(2) + "%",
            eastonValue:
              (
                currParse(
                  contractInfo?.amounttofinance /
                    ((currParse(vehicleData.chassis_east) || 0) +
                      currParse(vehicleData.conv_east || 0) +
                      currParse(eastonOptionsRef.current.value) || 0)
                ) * 100
              ).toFixed(2) + "%",
            diff:
              (
                currParse(
                  contractInfo?.amounttofinance /
                    ((currParse(vehicleData.chassis_dlr) || 0) +
                      currParse(vehicleData.conv_dlr || 0) +
                      currParse(dealerOptionsRef.current.value) || 0)
                ) *
                  100 -
                currParse(
                  contractInfo?.amounttofinance /
                    ((currParse(vehicleData.chassis_east) || 0) +
                      currParse(vehicleData.conv_east || 0) +
                      currParse(eastonOptionsRef.current.value) || 0)
                ) *
                  100
              ).toFixed(2) + "%",
          },
        ]);
        alert("Data saved successfully");
      } else {
        throw new Error("Error saving data");
      }
    } catch (error) {
      setIsSubmitting(false);
      alert("Error saving data: " + error.message);
    }
  };

  useEffect(() => {
    if (resetValues) {
      setTableData(vehicleData.tableData);
      setGridData(vehicleData.gridData);
      setIsLoading(false);
 
      setVehicleInfoTD([
        {
          field: "Chassis",
          dealerValue: currFormat(vehicleInfo?.dealer_chassis),
          eastonValue: currFormat(vehicleInfo?.easton_chassis),
          diff: currFormat(
            parseFloat(vehicleInfo?.dealer_chassis || 0) -
              (vehicleInfo?.easton_chassis || 0)
          ),
        },
        {
          field: "Conversion",
          dealerValue: currFormat(vehicleInfo?.dealer_conversion),
          eastonValue: currFormat(vehicleInfo?.easton_conversion),
          diff: currFormat(
            parseFloat(vehicleInfo?.dealer_conversion || 0) -
              (vehicleInfo?.easton_conversion || 0)
          ),
        },
        {
          field: "Options",
          dealerValue: currFormat(vehicleInfo?.dealer_options),
          eastonValue: currFormat(vehicleInfo?.easton_options),
          diff: currFormat(
            parseFloat(vehicleInfo?.dealer_options || 0) -
              (vehicleInfo?.easton_options || 0)
          ),
        },
        {
          field: "Total",
          dealerValue: currFormat(
            (parseFloat(vehicleInfo?.dealer_chassis) || 0) +
              (parseFloat(vehicleInfo?.dealer_conversion) || 0) +
              (parseFloat(vehicleInfo?.dealer_options) || 0)
          ),
          eastonValue: currFormat(
            (parseFloat(vehicleInfo?.easton_chassis) || 0) +
              (parseFloat(vehicleInfo?.easton_conversion) || 0) +
              (parseFloat(vehicleInfo?.easton_options) || 0)
          ),
          diff: currFormat(
            (parseFloat(vehicleInfo?.dealer_chassis) ||
              0 + parseFloat(vehicleInfo?.dealer_conversion) ||
              0 + parseFloat(vehicleInfo?.dealer_options) ||
              0) -
              (parseFloat(vehicleInfo?.easton_chassis) ||
                0 + parseFloat(vehicleInfo?.easton_conversion) ||
                0 + parseFloat(vehicleInfo?.easton_options) ||
                0)
          ),
        },
        {
          field: "LTV",
          dealerValue:
            (
              currParse(
                contractInfo?.amounttofinance /
                  ((currParse(vehicleInfo?.dealer_chassis) || 0) +
                    currParse(vehicleInfo?.dealer_conversion || 0) +
                    currParse(vehicleInfo?.dealer_options) || 0)
              ) * 100
            ).toFixed(2) + "%",
          eastonValue:
            (
              currParse(
                contractInfo?.amounttofinance /
                  ((currParse(vehicleInfo?.easton_chassis) || 0) +
                    currParse(vehicleInfo?.easton_conversion || 0) +
                    currParse(vehicleInfo?.easton_options) || 0)
              ) * 100
            ).toFixed(2) + "%",
          diff:
            (
              currParse(
                contractInfo?.amounttofinance /
                  ((currParse(vehicleInfo?.dealer_chassis) || 0) +
                    currParse(vehicleInfo?.dealer_conversion || 0) +
                    currParse(vehicleInfo?.dealer_options) || 0)
              ) *
                100 -
              currParse(
                contractInfo?.amounttofinance /
                  ((currParse(vehicleInfo?.easton_chassis) || 0) +
                    currParse(vehicleInfo?.easton_conversion || 0) +
                    currParse(vehicleInfo?.easton_options) || 0)
              ) *
                100
            ).toFixed(2) + "%",
        },
      ]);
    }
  }, [resetValues, vinValue, mileageValue, vehicleInfo]);

  const [vehicleInfoGD1, setVehicleInfoGD] = useState([
    {
      label: "VIN",
      value: vinValue || "",
      editable: true,
      color: "black",
    },
    {
      label: "Mileage",
      value: mileageValue || "",
      editable: true,
      color: "black",
    },
    {
      label: "Make",
      value: makeValue || "",
      editable: false,
      color: "black",
    },
    {
      label: "Model",
      value: modelValue || "",
      editable: false,
      color: "black",
    },
    {
      label: "Trim",
      value: trimValue || "",
      editable: false,
      color: "black",
    },
    {
      label: "Model Year",
      value: modelYearValue || "",
      editable: false,
      color: "black",
    },
  ]);

  const vehicleInfoGD = [
    {
      label: "VIN",
      value: vinValue || "",
      editable: true,
      color: "black",
    },
    {
      label: "Mileage",
      value: mileageValue || "",
      editable: true,
      color: "black",
    },
    {
      label: "Make",
      value: makeValue || "",
      editable: false,
      color: "black",
    },
    {
      label: "Model",
      value: modelValue || "",
      editable: false,
      color: "black",
    },
    {
      label: "Trim",
      value: trimValue || "",
      editable: false,
      color: "black",
    },
    {
      label: "Model Year",
      value: modelYearValue || "",
      editable: false,
      color: "black",
    },
  ];

  useEffect(() => {
    const fetchVehAppAsync = async () => {
      if (vinValue?.length === 17) {
        try {
          const VehAppdata = await fetchVehApp(submission_id);
          setMakeValue(VehAppdata.make);
          setModelValue(VehAppdata.model);
          setTrimValue(VehAppdata.trim);
          setModelYearValue(VehAppdata.modelyear);
        } catch (error) {
          // fetchRawAsync(vinValue);
          console.log(error.message);
        }
      }
    };
    fetchVehAppAsync();
  }, [borrowerInfo]);

  const fetchRawAsync = async () => {
    const vehicleInfo = await fetchVehRaw(vinValue);

    setMakeValue(vehicleInfo?.Make);
    setModelValue(vehicleInfo?.Model);
    setTrimValue(vehicleInfo?.Trim);
    setModelYearValue(vehicleInfo?.ModelYear);
  };

  const fetchDBAsync = async () => {
    try {
      const VehDBdata = await fetchVehDB(vehicleInfoGD);
      setVehicleDBtableData(VehDBdata);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  const handleInputBlur = () => {
    // Parse and sum the dealer values
    const dealerConvValue = currParse(dealerConvRef.current?.value || 0);
    const dealerOptionsValue = currParse(dealerOptionsRef.current?.value || 0);
    const dealerChassisValue = currParse(dealerChassisRef.current?.value || 0);
    const totalDealer =
      dealerConvValue + dealerOptionsValue + dealerChassisValue;

    // Parse and sum the Easton values
    const eastonConvValue = currParse(eastonConvRef.current?.value || 0);
    const eastonOptionsValue = currParse(eastonOptionsRef.current?.value || 0);
    const eastonChassisValue = currParse(eastonChassisRef.current?.value || 0);
    const totalEaston =
      eastonConvValue + eastonOptionsValue + eastonChassisValue;

    // Update the totals using refs
    if (dealerTotalRef.current) {
      dealerTotalRef.current.innerText = currFormat(totalDealer || 0);
    }
    if (eastonTotalRef.current) {
      eastonTotalRef.current.innerText = currFormat(totalEaston || 0);
    }
  };

  const [vehicleInfoTD, setVehicleInfoTD] = useState([
    {
      field: "Chassis",
      dealerValue: currFormat(vehicleInfo?.dealer_chassis),
      eastonValue: currFormat(vehicleInfo?.easton_chassis),
      diff: currFormat(
        parseFloat(vehicleInfo?.dealer_chassis || 0) -
          (vehicleInfo?.easton_chassis || 0)
      ),
    },
    {
      field: "Conversion",
      dealerValue: currFormat(vehicleInfo?.dealer_conversion),
      eastonValue: currFormat(vehicleInfo?.easton_conversion),
      diff: currFormat(
        parseFloat(vehicleInfo?.dealer_conversion || 0) -
          (vehicleInfo?.easton_conversion || 0)
      ),
    },
    {
      field: "Total",
      dealerValue: currFormat(
        (parseFloat(vehicleInfo?.dealer_chassis) || 0) +
          (parseFloat(vehicleInfo?.dealer_conversion) || 0)
      ),
      eastonValue: currFormat(
        (parseFloat(vehicleInfo?.easton_chassis) || 0) +
          (parseFloat(vehicleInfo?.easton_conversion) || 0)
      ),
      diff: currFormat(
        (parseFloat(vehicleInfo?.dealer_chassis) || 0) +
          (parseFloat(vehicleInfo?.dealer_conversion) || 0) -
          ((parseFloat(vehicleInfo?.easton_chassis) || 0) +
            (parseFloat(vehicleInfo?.easton_conversion) || 0))
      ),
    },
    {
      field: "LTV",
      dealerValue:
        (
          (currParse(contractInfo?.amounttofinance) /
            ((currParse(vehicleInfo?.dealer_chassis) || 0) +
              currParse(vehicleInfo?.dealer_conversion || 0))) *
          100
        ).toFixed(2) + "%",
      eastonValue:
        (
          currParse(
            contractInfo?.amounttofinance /
              ((currParse(vehicleInfo?.easton_chassis) || 0) +
                currParse(vehicleInfo?.easton_conversion || 0))
          ) * 100
        ).toFixed(2) + "%",
      diff:
        (
          currParse(
            contractInfo?.amounttofinance /
              ((currParse(vehicleInfo?.dealer_chassis) || 0) +
                currParse(vehicleInfo?.dealer_conversion || 0))
          ) *
            100 -
          currParse(
            contractInfo?.amounttofinance /
              ((currParse(vehicleInfo?.easton_chassis) || 0) +
                currParse(vehicleInfo?.easton_conversion || 0))
          ) *
            100
        ).toFixed(2) + "%",
    },
  ]);

  const VehicleTable = () => {
    return (
      <TableContainer>
        <Text fontWeight="bold" fontSize="11px" size="xs">
          <Table padding="0" margin="0">
            <Thead>
              <Tr>
                <Th>Field</Th>
                <Th>Easton</Th>
                <Th>Dealer</Th>
                <Th>Diff</Th>
              </Tr>
            </Thead>
            <Tbody fontSize="11px" size="xs">
              {vehicleInfoTD &&
                vehicleInfoTD.map((label, index) => (
                  <Tr key={index}>
                    <Td style={{ lineHeight: "0", height: "5px" }}>
                      {label.field}
                    </Td>
                    <Td style={{ lineHeight: "0", height: "5px" }}>
                      {label.eastonValue}
                    </Td>
                    <Td style={{ lineHeight: "0", height: "5px" }}>
                      {label.dealerValue}
                    </Td>
                    <Td style={{ lineHeight: "0", height: "5px" }}>
                      {label.diff}
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Text>
      </TableContainer>
    );
  };

  useEffect(() => {
    saveToLocalStorage();
  }, [vehicleInfoGD, vehicleInfoTD]);

  const saveToLocalStorage = () => {
    const vehicleDataToSave = {
      vehicleInfoGD: vehicleInfoGD,
      vehicleInfoTD: vehicleInfoTD,
    };
    localStorage.setItem("VehicleLS", JSON.stringify(vehicleDataToSave));
  };

  const [chassisRetailValue, setChassisRetailValue] = useState();
  const [chassisPrivpartyValue, setChassisPrivpartyValue] = useState();
  const [chassisTradeinValue, setChassisTradeinValue] = useState();
  const [mileageValuationValue, setMileageValuationValue] = useState();
  const handlePopupButtonClick = async () => {
    handleInputBlur();
    setIsOpen(true);
    try {
      await fetchDBAsync();
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
    handleInputBlur();
  };
  const [preventFormSubmit, setPreventFormSubmit] = useState(false);

  const fetchCarFax = async (event) => {
    setPreventFormSubmit(true);

    try {
      const carfax = await getValuation(vehicleInfo.vin, borrowerInfo.zipcode);
      setChassisRetailValue(carfax.retail_price);
      setChassisPrivpartyValue(carfax.privparty_price);
      setChassisTradeinValue(carfax.tradein_price);
      setMileageValuationValue(carfax.mileage_price);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    } finally {
      setPreventFormSubmit(false);
    }
  };

  useEffect(() => {
    console.log("eastonOptions changed:", eastonOptions);
  }, [eastonOptions]);

  useEffect(() => {
    console.log("vehicleInfo changed:", vehicleInfo);
  }, [vehicleInfo]);

  useEffect(() => {
    console.log("vinValue changed:", vinValue);
  }, [vinValue]);

  const parseICurrency = (value) => {
    return value.replace(/[^0-9.]+/g, ""); // Remove all non-numeric characters
  };

  const handleCurrencyIChange = (e) => {
    const parsedValue = parseICurrency(e.target.value);
    e.target.value = currFormat(parsedValue);
  };

  useQuery(["vin", vinValue], () => fetchRawAsync(), {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return (
    <Box minW={{ sm: "100%", md: "420px" }} maxW={{ sm: "100%", md: "420px" }}>
      <Box
        bg="yellow.700"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="5px 8px"
        w="100%"
      >
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <Icon as={FaList} color="white" mr="10px" />
          <Text color="white">Vehicle</Text>
        </Box>
        <Button
          onClick={() => {
            setIsLoading(true);
            dispatch(getVehicleDetails(borrowerInfo.zip, vehicleInfo.vin));
            setIsLoading(false);
          }}
          leftIcon={<Icon as={FaSyncAlt} />}
          size="xs"
          isLoading={isLoading}
          loadingText="Reloading"
        >
          Reload
        </Button>
        <Button
          onClick={() => handlePopupButtonClick()}
          size="xs"
          colorScheme="teal"
        >
          Open Pop-up
        </Button>
      </Box>
      <Box p="8px" w="100%">
        <SimpleGrid columns={{ sm: 1, md: 2 }}>
          {vehicleInfoGD &&
            vehicleInfoGD.map((item, index) => (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                padding="5px 8px"
                key={index}
                border="1px solid gray"
                minH="30px"
              >
                <Text fontWeight="bold" fontSize="11px">
                  {item.label}
                </Text>
                {item.editable ? (
                  <input
                    type="text"
                    defaultValue={item.value}
                    style={{
                      fontSize: "11px",
                      color: item.color === "blue" ? "blue" : "blue",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "2px 4px",
                    }}
                    onChange={(e) => {
                      if (item.label === "VIN") {
                        setVinValue(e.target.value);
                      } else if (item.label === "Mileage") {
                        setMileageValue(e.target.value);
                      }
                    }}
                  />
                ) : (
                  <Text
                    fontSize="11px"
                    fontWeight={item.isBold ? "normal" : "normal"}
                    color={item.color}
                  >
                    {item.value}
                  </Text>
                )}
              </Box>
            ))}
        </SimpleGrid>
        {<VehicleTable />}
      </Box>
      <CustomModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        vinValue={vinValue}
        mileageValue={mileageValue}
        modelYearValue={modelYearValue}
        makeValue={makeValue}
        modelValue={modelValue}
        trimValue={trimValue}
        fetchCarFax={fetchCarFax}
        isUpdatingVal={isUpdatingVal}
        chassisRetailValue={chassisRetailValue}
        chassisPrivpartyValue={chassisPrivpartyValue}
        chassisTradeinValue={chassisTradeinValue}
        mileageValuationValue={mileageValuationValue}
        selectedConvManu={selectedConvManu}
        setSelectedConvManu={setSelectedConvManu}
        handleInputBlur={handleInputBlur}
        isNewChassis={isNewChassis}
        isNewChassisRef={isNewChassisRef}
        isNewConvRef={isNewConvRef}
        isSide={isSide}
        isSideRef={isSideRef}
        isMotorized={isMotorized}
        isMotorizedRef={isMotorizedRef}
        isInFloor={isInFloor}
        isInFloorRef={isInFloorRef}
        handleCurrencyIChange={handleCurrencyIChange}
        dealerChassis={dealerChassis}
        vehicleInfoTD={vehicleInfoTD}
        dealerChassisRef={dealerChassisRef}
        dealerConv={dealerConv}
        dealerConvRef={dealerConvRef}
        dealerOptions={dealerOptions}
        dealerOptionsRef={dealerOptionsRef}
        dealerTotalRef={dealerTotalRef}
        eastonChassis={eastonChassis}
        eastonChassisRef={eastonChassisRef}
        eastonConv={eastonConv}
        eastonConvRef={eastonConvRef}
        eastonOptions={eastonOptions}
        eastonOptionsRef={eastonOptionsRef}
        eastonTotalRef={eastonTotalRef}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        fetchDBAsync={fetchDBAsync}
        vehicleDBtableData={vehicleDBtableData}
      />
      
    </Box>
  );
};

const CustomModal = ({
  isOpen,
  setIsOpen,
  vinValue,
  mileageValue,
  modelYearValue,
  makeValue,
  modelValue,
  trimValue,
  fetchCarFax,
  isUpdatingVal,
  chassisRetailValue,
  chassisPrivpartyValue,
  chassisTradeinValue,
  mileageValuationValue,
  selectedConvManu,
  setSelectedConvManu,
  handleInputBlur,
  isNewChassis,
  isNewChassisRef,
  isNewConvRef,
  isSide,
  isSideRef,
  isMotorized,
  isMotorizedRef,
  isInFloor,
  isInFloorRef,
  handleCurrencyIChange,
  dealerChassis,
  vehicleInfoTD,
  dealerChassisRef,
  dealerConv,
  dealerConvRef,
  dealerOptions,
  dealerOptionsRef,
  dealerTotalRef,
  eastonChassis,
  eastonChassisRef,
  eastonConv,
  eastonConvRef,
  eastonOptions,
  eastonOptionsRef,
  eastonTotalRef,
  isSubmitting,
  handleSubmit,
  fetchDBAsync,
  vehicleDBtableData,
}) => (
  <Box borderWidth={1} borderColor="gray.200" borderRadius="sm">
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="2xl"
      maxW="75%"
    >
      <ModalOverlay />
      <ModalContent maxW="75%">
        <ModalHeader fontSize="sm">VehicleDB</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {" "}
          <Grid templateColumns="repeat(8, 1fr)" gap={1} colSpan={9}>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontSize="xs">VIN</FormLabel>
                <Text fontSize="xs">{vinValue}</Text>
                {/* <Text fontSize="xs">{vin || vinValue}</Text> */}
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel fontSize="xs">Mileage</FormLabel>
                <Text fontSize="xs">
                  {mileageValue || ""}
                  {/* {mileageValue || vehicleInfo?.Mileage || " "} */}
                </Text>
              </FormControl>
            </GridItem>
            <GridItem colSpan={0.5}>
              <FormControl>
                <FormLabel fontSize="xs">ModelYear</FormLabel>
                <Text fontSize="xs">
                  {modelYearValue || ""}
                  {/* {modelYearValue || vehicleInfo?.modelyear || " "} */}
                </Text>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontSize="xs">Make</FormLabel>
                <Text fontSize="xs">
                  {makeValue || ""}
                  {/* {makeValue || vehicleInfo?.make || " "} */}
                </Text>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1.5}>
              <FormControl>
                <FormLabel fontSize="xs">Model</FormLabel>
                <Text fontSize="xs">
                  {modelValue || ""}
                  {/* {modelValue || vehicleInfo?.model || " "} */}
                </Text>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel fontSize="xs">Trim</FormLabel>
                <Text fontSize="xs">
                  {trimValue || ""}
                  {/* {trimValue || vehicleInfo?.trim || " "} */}
                </Text>
              </FormControl>
            </GridItem>
          </Grid>
          {""}
          <GridItem colSpan={7}>
            <Box borderBottom="3px solid" borderColor="gray.200" mb={4} />
          </GridItem>
          <Grid templateColumns="repeat(8, 1fr)" gap={5} colSpan={8}>
            <GridItem colSpan={2}>
              <Button
                colorScheme="blue"
                onClick={(event) => fetchCarFax(event)}
                isLoading={isUpdatingVal}
                type="button"
                size="xs"
              >
                CarFax
              </Button>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel fontSize="xs">Retail</FormLabel>
                <Text fontSize="xs">{chassisRetailValue || " "}</Text>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel fontSize="xs">PrivParty</FormLabel>
                <Text fontSize="xs">{chassisPrivpartyValue || " "}</Text>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel fontSize="xs">TradeIn</FormLabel>
                <Text fontSize="xs">{chassisTradeinValue || " "}</Text>
              </FormControl>
            </GridItem>
            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel fontSize="xs">ValuationMileage</FormLabel>
                <Text fontSize="xs">{mileageValuationValue || " "}</Text>
              </FormControl>
            </GridItem>
          </Grid>{" "}
          <Flex direction="row">
            <ConvDropdowns
              selectedConvManu={selectedConvManu}
              setSelectedConvManu={setSelectedConvManu}
              handleInputBlur={handleInputBlur}
            />
          </Flex>
          <GridItem fontSize="xs" colSpan={4}>
            <Box fontSize="xs">
              <SimpleGrid columns={3} spacing={2}>
                <Checkbox
                  defaultChecked={isNewChassis}
                  name="isNewChassis"
                  ref={isNewChassisRef}
                >
                  <Text fontSize="xs">New Chassis</Text>
                </Checkbox>
                <Checkbox name="isNewConv" ref={isNewConvRef}>
                  <Text fontSize="xs">New Conv</Text>
                </Checkbox>
                <Checkbox defaultChecked={isSide} name="isSide" ref={isSideRef}>
                  <Text fontSize="xs">Side</Text>
                </Checkbox>
                <Checkbox
                  defaultChecked={isMotorized}
                  name="isMotorized"
                  ref={isMotorizedRef}
                >
                  <Text fontSize="xs">Motorized</Text>
                </Checkbox>
                <Checkbox
                  defaultChecked={isInFloor}
                  name="isInFloor"
                  ref={isInFloorRef}
                >
                  <Text fontSize="xs">In-Floor</Text>
                </Checkbox>
              </SimpleGrid>
            </Box>
          </GridItem>{" "}
          {/* Dealer and Easton input fields */}
          <Grid templateColumns="repeat(8, 1fr)" gap={2} mt={4}>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontSize="xs">Dealer_Chassis</FormLabel>
                <Input
                  name="dealerChassis"
                  type="text"
                  size="xs"
                  fontSize="xs"
                  onChange={handleCurrencyIChange}
                  defaultValue={
                    dealerChassis ||
                    vehicleInfoTD[0].dealerValue ||
                    currFormat(0)
                  }
                  ref={dealerChassisRef}
                  onBlur={handleInputBlur}
                  id="dealerChassis"
                  style={{ textAlign: "right" }}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontSize="xs">Dealer_Conv</FormLabel>
                <Input
                  name="dealerConv"
                  type="text"
                  size="xs"
                  fontSize="xs"
                  onChange={handleCurrencyIChange}
                  defaultValue={
                    dealerConv || vehicleInfoTD[1].dealerValue || currFormat(0)
                  }
                  ref={dealerConvRef}
                  onBlur={handleInputBlur}
                  id="dealerConv"
                  style={{ textAlign: "right" }}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontSize="xs">Dealer_Options</FormLabel>
                <Input
                  name="dealerOptions"
                  type="text"
                  size="xs"
                  fontSize="xs"
                  onChange={handleCurrencyIChange}
                  defaultValue={
                    dealerOptions ||
                    vehicleInfoTD[2].dealerValue ||
                    currFormat(0)
                  }
                  ref={dealerOptionsRef}
                  onBlur={handleInputBlur}
                  id="dealerOptions"
                  style={{ textAlign: "right" }}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontSize="xs">Dealer_Total</FormLabel>
                <span
                  name="dealerTotal"
                  //size="xs"
                  //fontSize="xs"
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    display: "block",
                    textAlign: "right",
                  }}
                  ref={dealerTotalRef}
                >
                  {currFormat(vehicleInfoTD[3].dealerValue)}
                </span>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontSize="xs">Easton_Chassis</FormLabel>
                <Input
                  name="eastonChassis"
                  type="text"
                  size="xs"
                  fontSize="xs"
                  onChange={handleCurrencyIChange}
                  defaultValue={
                    eastonChassis ||
                    vehicleInfoTD[0].eastonValue ||
                    currFormat(0)
                  }
                  onBlur={handleInputBlur}
                  ref={eastonChassisRef}
                  style={{ paddingRight: 2, textAlign: "right" }}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontSize="xs">Easton_Conv</FormLabel>
                <Input
                  name="eastonConv"
                  type="text"
                  size="xs"
                  fontSize="xs"
                  onChange={handleCurrencyIChange}
                  defaultValue={
                    eastonConv || vehicleInfoTD[1].eastonValue || currFormat(0)
                  }
                  onBlur={handleInputBlur}
                  ref={eastonConvRef}
                  style={{ paddingRight: 2, textAlign: "right" }}
                />
              </FormControl>{" "}
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontSize="xs">Easton_Options</FormLabel>
                <Input
                  name="eastonOptions"
                  type="text"
                  size="xs"
                  fontSize="xs"
                  onChange={handleCurrencyIChange}
                  defaultValue={
                    eastonOptions ||
                    vehicleInfoTD[2].eastonValue ||
                    currFormat(0)
                  }
                  onBlur={handleInputBlur}
                  ref={eastonOptionsRef}
                  style={{ paddingRight: 2, textAlign: "right" }}
                />
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel fontSize="xs">Easton_Total</FormLabel>
                <span
                  name="eastonTotal"
                  size="xs"
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    display: "block",
                    textAlign: "right",
                  }}
                  ref={eastonTotalRef}
                >
                  {currFormat(vehicleInfoTD[3].eastonValue)}
                </span>
              </FormControl>
            </GridItem>
          </Grid>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
            onClick={handleSubmit}
            size="xs"
          >
            Submit
          </Button>
          <Button
            mt={4}
            colorScheme="blue"
            onClick={() => fetchDBAsync(vinValue)}
            size="xs"
          >
            ReloadDB
          </Button>
          <Box width="100%" overflowX="auto">
            <ReactTable2 VehDBdata={vehicleDBtableData} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  </Box>
);

export default VehicleCard;
