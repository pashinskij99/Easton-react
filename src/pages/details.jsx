import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Text, Tag, Select, Button } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import BorrowerCard from "../components/BorrowerCard";
import CoBorrowerCard from "../components/CoBorrowerCard";
import IncomeCard from "../components/IncomeCard";
import VehicleCard from "../components/VehicleCard";
import ContractCard from "../components/ContractCard";
import RateGridCard from "../components/RateGridCard";
import TermsCard from "../components/TermsCard";
import { getBorrowerDetails } from "../store/borrower";
import { getAppList } from "../store/appList";
import { termsData, vehicleData } from "../mock";
import MyProvider from './MyProvider';

function Details() {
  const dispatch = useDispatch();
  const appListStore = useSelector((state) => state.appList);
  const borrowerStore = useSelector((state) => state.borrower);
  const incomeStore = useSelector((state) => state.income);
  const rateGridStore = useSelector((state) => state.rateGrid);
  const vehicleStore = useSelector((state) => state.vehicle);
  const contractStore = useSelector((state) => state.contract);
  const [application, setApplication] = useState(null);
  const [terms, setTerms] = useState(null);
  const [paymentProp, setPaymentProp] = useState(0);
  const [paymentValue, setPaymentValue] = useState("");
  const [updateTotalCashPrice] = useState(0);
  useEffect(() => {
    dispatch(getAppList());
  }, []);

  useEffect(() => {
    if (appListStore.appList.length > 0) {
      const payload = {
        submission_id: appListStore.appList[0].submission_id,
      };
      setApplication(appListStore.appList[0]);
      dispatch(getBorrowerDetails(payload));
      window.localStorage.setItem("ApplicationLS", JSON.stringify(appListStore.appList[0]));
    }
  }, [appListStore.appList]);

  useEffect(() => {
    const termsResult = {
      rate: rateGridStore?.rateGrid?.apr ?? 0,
      term: rateGridStore?.rateGrid?.term ?? 0,
      total_cost: vehicleStore?.vehicle?.price ?? 0,
      down_payment: vehicleStore?.vehicle?.down_payment ?? 0,
      trade_in: vehicleStore?.vehicle?.trade_in ?? 0,
      sales_tax: vehicleStore?.vehicle?.sales_tax ?? 0,
      doc_fee: vehicleStore?.vehicle?.doc_fee ?? 0,
      title_fee: vehicleStore?.vehicle?.title_fee ?? 0,
    };
    setTerms(termsResult);
  }, [rateGridStore, vehicleStore]);
  const handleAppChange = (e) => {
    const payload = {
      submission_id: e.target.value,
    };
    const currentApp = appListStore.appList.find(
      (item) => item.submission_id === e.target.value
    );
    setApplication(currentApp);
    dispatch(getBorrowerDetails(payload));
    window.localStorage.setItem("ApplicationLS", JSON.stringify(appListStore.appList[0]));
  };

  const handleSaveDetails = () => {
    const finalResult = {
      borrower: borrowerStore.borrower,
      coBorrower: borrowerStore.coBorrower,
      income: incomeStore.income,
      vehicle: vehicleStore,
      contract: JSON.parse(window.localStorage.getItem("contract")),
      rateGrid: rateGridStore.rateGrid,
      terms: termsData,
    };

    // Save the application data to local storage
    window.localStorage.setItem("ApplicationLS", JSON.stringify(application));
  };

  const disableSaveButton = useMemo(() => {
    if (
      appListStore.isLoading ||
      borrowerStore.isLoading ||
      incomeStore.isLoading ||
      rateGridStore.isLoading
    ) {
      return true;
    }
    return false;
  }, [appListStore, borrowerStore, incomeStore, rateGridStore]);

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        flexWrap="wrap"
        p="8px"
        mb="8px"
        position="relative"
      >
        <Button
          leftIcon={<FaSave />}
          colorScheme="teal"
          variant="solid"
          position="absolute"
          right="0px"
          top="10px"
          size="sm"
          disabled={disableSaveButton}
          onClick={() => handleSaveDetails()}
        >
          Save
        </Button>
        {appListStore.appList.length > 0 && (
          <Box mr="8px">
            <Select placeholder="" w="220px" onChange={handleAppChange}>
              {appListStore.appList.map((item, index) => (
                <option value={item.submission_id} key={index}>
                  {item.appname_time.split(" ")[0]}
                  {window.localStorage.setItem("ApplicationLS", JSON.stringify(application))};
                </option>
              ))}
            </Select>
          </Box>
        )}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mr="16px"
        >
          <Tag mr="8px" colorScheme="red">
            <Text fontWeight="bold">Application</Text>
          </Tag>
          <Text>{application?.appname_time || ""}</Text>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mr="16px"
          mb="8px"
        >
          <Tag mr="8px" colorScheme="red">
            <Text fontWeight="bold">Dealer</Text>
          </Tag>
          <Text>{application?.dealer || ""}</Text>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mr="16px"
          mb="8px"
        >
          <Tag mr="8px" colorScheme="blue">
            <Text>Salesperson</Text>
          </Tag>
          <Text>{application?.salesperson || ""}</Text>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mr="16px"
          mb="8px"
        >
          <Tag mr="8px" colorScheme="blue">
            <Text>Vehicle User</Text>
          </Tag>
          <Text>{application?.vehicleuser || ""}</Text>
        </Box>
      </Box>

      <Box
        display="flex"
        alignItems="flex-start"
        flexWrap="wrap"
        className="justify-center md:justify-start p-2"
      >
        <Box
          bg="red.50"
          className="w-full md:w-auto min-w-[250px] mr-0 md:mr-4 mb-2"
        >
          <BorrowerCard />
        </Box>
        <Box
          bg="gray.50"
          className="w-full md:w-auto min-w-[250px] mr-0 md:mr-4 mb-2"
        >
          <CoBorrowerCard />
        </Box>
        <Box
          bg="pink.50"
          className="w-full md:w-auto min-w-[250px] mr-0 md:mr-4 mb-2"
        >
          <IncomeCard payment={paymentProp} />
        </Box>
        <Box
          bg="yellow.50"
          className="w-full md:w-auto min-w-[250px] mr-0 md:mr-4 mb-2"
        >
          <VehicleCard updateTotalCashPrice={updateTotalCashPrice} />
        </Box>
        <Box
          bg="green.50"
          className="w-full md:w-auto min-w-[250px] mr-0 md:mr-4 mb-2"
        >
          <ContractCard paymentValueProp={paymentValue} setPaymentValueProp={setPaymentValue} />
        </Box>
        <Box
          bg="purple.50"
          className="w-full md:w-auto min-w-[250px] mr-0 md:mr-4 mb-2"
        >
          <RateGridCard submission_id={application?.submission_id} />
        </Box>
      </Box>
    </Box>
  );
};

const WrappedDetails = () => (
  <MyProvider>
    <Details />
  </MyProvider>
);

export default WrappedDetails;
