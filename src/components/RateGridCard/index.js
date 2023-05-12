import { useEffect, useState, useCallback, useRef, createRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Icon,
  Box,
  Text,
  IconButton,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  TableContainer,
  Button,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { FaQuestionCircle, FaList, FaClipboardList } from "react-icons/fa";
import {
  getRateGridDetails,
  sendRateSheet,
  getDealers,
} from "../../store/rateGrid";
import { vehicleData } from "../../mock";
import { debounce } from "lodash";
import ModalAllRules from "./ModalAllRules";
const Finance = require("tvm-financejs");
const finance = new Finance();

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
  val = Number(val);
  val = Math.round(val);
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

const RateGridCard = ({submission_id}) => {
  const dispatch = useDispatch();
  const rateGridStore = useSelector((state) => state.rateGrid);
  const incomeStore = useSelector((state) => state.income);
  const borrowerStore = useSelector((state) => state.borrower);
  const vehicleStore = useSelector((state) => state.vehicle);
  const contractStore = useSelector((state) => state.contract);
  const [isOpen, setIsOpen] = useState(false);
  const contractInfo = borrowerStore.all[2]?.contract;
  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // useEffect(() => {
  //   const submission_id = JSON.parse(window.localStorage.getItem("ApplicationLS")).submission_id

  // }, [])

  const loadFromLocalStorage = (key) => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  };

  const handleLocalStorageUpdate = (key, value) => {
    saveToLocalStorage(key, value);
    handleReload();
  };

  const [emailAddress, setEmailAddress] = useState(
    borrowerStore.borrower.email
  );
  const [emailSubject, setEmailSubject] = useState("");
  const contractLS = loadFromLocalStorage("ContractLS");
  const vehicleLS = loadFromLocalStorage("VehicleLS");
  const termsLS = loadFromLocalStorage("TermsLS");
  const parsedValue = percentParse(vehicleLS?.vehicleInfoTD[3]?.eastonValue);
  const defaultLtv = isNaN(parsedValue) ? 100 : parsedValue;
  const defaultscore = Number(borrowerStore.all[0]?.borrower?.creditscore || 0);
  const [adjustedRates, setAdjustedRates] = useState(rateGridStore.rateGrid);

  const [ltv, setLtv] = useState();
  const [score, setScore] = useState();
  const [adjValues, setAdjValues] = useState(
    Array(rateGridStore.rateGrid?.length).fill(0.0)
  );

  const [ltvOverride, setLtvOverride] = useState("");
  const [scoreOverride, setScoreOverride] = useState("");
  const [pmtValues, setPmtValues] = useState(
    Array(rateGridStore.rateGrid?.length).fill(0)
  );
  var dealeremail = "";
  var customemailsubj = "";

  const handleReloadDebounced = debounce(() => handleReload(), 500);

  const handleChange = (newValue, override) => {
    if (override === "ltv") {
      setLtvOverride(newValue);
    } else if (override === "score") {
      setScoreOverride(newValue);
    }
  };

  const [amt] = useState(contractInfo?.amounttofinance || 50000);

  function calculate_payment(amt, rate, term, contractdate, firstpmtdate) {
    const loan_b1 = parseFloat(amt);
    const rate_b2 = parseFloat(rate);
    const rate_b2a = rate_b2 / 1200;
    const term_b3 = parseFloat(term);
    const accruedt_b4 = new Date(contractdate);
    const pmtdt_b5 = new Date(firstpmtdate);
    const diffMilliseconds = parseFloat(pmtdt_b5 - accruedt_b4);

    // Convert the difference from milliseconds to days
    const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24);

    // Round the result to get the difference in days
    const roundedDays = Math.round(diffDays, 0);

    //Daily Effective Interest Rate
    const dlyrt = (1 + rate_b2 / 12) ** (12 / 365) - 1;
    //Odd Interest Period (Days)
    const odddays = Math.round(roundedDays - 30, 0);

    //Interest for Odd Period
    const oddint = loan_b1 * (1 + dlyrt) ** odddays - loan_b1;
    //Amount to be Financed
    const amtfin = loan_b1 * (1 + dlyrt) ** odddays;
    //Monthly Payments
    const prec_pmt =
      Math.round(
        (rate_b2a + rate_b2a / ((1 + rate_b2a) ** term_b3 - 1)) * loan_b1 * 100
      ) / 100;
    return prec_pmt;
  }

  const calculatePmtValues = useCallback(
    (rates) => {
      if (!rates) return;
      const newPmtValues = rates.map((item, index) => {
        const adjr = Number(adjValues[index]) || 0;
        const originalRate = Number(percentParse(item.rate) * 100);
        const rate = originalRate + adjr;
        const amtc = contractInfo.amounttofinance || 50000;
        const term = item.term;
        const contractdate = contractInfo.contractdate;
        const firstpmtdate = contractInfo.firstpmtdate;
        return calculate_payment(amtc, rate, term, contractdate, firstpmtdate);
      });
      setPmtValues(newPmtValues);
    },
    [adjValues, contractInfo]
  );

  const adjustRates = useCallback(
    (data, adjValues) => {
      if (!Array.isArray(data)) {
        console.error("Data parameter must be an array");
        return [];
      }
      const updatedRates = data.map((item, index) => {
        const adjustment = Number(adjValues[index] / 100) || 0;
        const updatedRate = Number(item.rate) + adjustment;
        return { ...item, rate: updatedRate };
      });
      setAdjustedRates(updatedRates);
      calculatePmtValues(updatedRates); // Call calculatePmtValues here
    },
    [calculatePmtValues]
  );

  const handleReload = useCallback(() => {
    const finalLtv = ltvOverride !== "" ? ltvOverride : defaultLtv;
    const finalScore = scoreOverride !== "" ? scoreOverride : defaultscore;

    if (
      finalLtv >= 50 &&
      finalLtv <= 100 &&
      finalScore >= 500 &&
      finalScore <= 800
    ) {
      const payload = {
        ltv: percentParse(finalLtv) / 100,
        score: finalScore,
        amt: amt,
      };
      dispatch(getRateGridDetails(payload));
      setAdjValues(Array(rateGridStore.rateGrid?.length).fill(0));
    }
  }, [ltvOverride, scoreOverride, defaultLtv, defaultscore, amt, dispatch]);

  const handleOpen = async () => {
    const dealersData = await dispatch(getDealers());
    const applicationLS = JSON.parse(localStorage.getItem("ApplicationLS"));
    const dealerIdSubstring = applicationLS?.dealer.slice(-3);

    var customemailsubj =
      "Mobility Loan Rates for " + borrowerStore.all[0]?.borrower.lastname;

    var emailAddresses = dealersData?.payload
      .filter((dealer) =>
        dealer.dealerid.toString().endsWith(dealerIdSubstring)
      )
      .map((dealer) => dealer.emailaddr)
      .join(", ");
    // Update emailAddress state
    dealeremail = emailAddresses;
    setEmailAddress(dealeremail);
    customemailsubj =
      "Mobility Loan Rates for " + borrowerStore.all[0]?.borrower.lastname;
    setEmailSubject(customemailsubj);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSend = () => {
    const Idata = {
      lastname: borrowerStore.all[0]?.borrower.name,
      vin: vehicleLS.vehicleInfoGD[0]?.value,
      date: termsLS[0]?.value,
      cashdown: contractLS[2]?.value,
      loansize: amt,
      email: dealeremail, //borrowerStore.all[0]?.borrower.email,
      emailAddress,
      emailSubject,
    };

    // Combine rateGridStore data with 'adj' and 'hide' values
    const combinedRateGridData = rateGridStore.rateGrid.map((item, index) => ({
      ...item,
      adj: adjValues[index],
      hide: hideCheckboxes[index],
    }));

    // Add combined rateGrid data to Idata object
    Idata.rateGridStoreData = combinedRateGridData;

    // Stringify the Idata object to prepare it for sending
    const payload = JSON.stringify(Idata);

    dispatch(sendRateSheet(payload));
    setIsOpen(false);
  };

  const handleEmailAddressChange = (event) => {
    setEmailAddress(event.target.value);
  };

  const handleEmailSubjectChange = (event) => {
    setEmailSubject(event.target.value);
  };

  const handleAdjChange = (index, nextValue) => {
    const newAdjValues = [...adjValues];
    newAdjValues[index] = nextValue;
    setAdjValues(newAdjValues);
    saveToLocalStorage();
    const adjustedRates = adjustRates(rateGridStore, newAdjValues);
    calculatePmtValues(adjustedRates);
  };

  useEffect(() => {
    const contractLS = loadFromLocalStorage("ContractLS");
    const termsLS = loadFromLocalStorage("TermsLS");
  }, [loadFromLocalStorage("ContractLS"), loadFromLocalStorage("TermsLS")]);

  useEffect(() => {
    handleReload();
  }, [handleReload]);

  useEffect(() => {
    if (rateGridStore.rateGrid.length) {
      calculatePmtValues(adjustedRates);
    }
  }, [adjustedRates, calculatePmtValues, rateGridStore.rateGrid]);

  useEffect(() => {
    dispatch(getRateGridDetails());
  }, [dispatch]);

  useEffect(() => {
    setLtvOverride("");
    setScoreOverride("");
    setAdjValues(Array(rateGridStore.rateGrid.length).fill(0));
    setHideCheckboxes(Array(rateGridStore.rateGrid.length).fill(false));
  }, [borrowerStore, vehicleStore]);

  useEffect(() => {
    setAdjustedRates(rateGridStore.rateGrid);
  }, [rateGridStore.rateGrid]);

  const handleActiveChange = (index, isChecked) => {
    const newRateGrid = rateGridStore.rateGrid.map((item, i) => {
      if (i === index) {
        return { ...item, active: isChecked };
      }
      return item;
    });
    handleLocalStorageUpdate("RateGridLS", newRateGrid);
    handleHideCheckboxChange(index, isChecked);
    calculatePmtValues();
  };

  const [hideCheckboxes, setHideCheckboxes] = useState(
    Array(rateGridStore.rateGrid?.length).fill(false)
  );

  const handleHideCheckboxChange = (index, isChecked) => {
    const newHideCheckboxes = [...hideCheckboxes];
    newHideCheckboxes[index] = isChecked;
    setHideCheckboxes(newHideCheckboxes);
  };

  const [openAllRulesModal, setOpenAllRulesModal] = useState(false);

  const handleOpenAllRules = () => {
    setOpenAllRulesModal(true);
  };

  return (
    <Box minW={{ sm: "100%", md: "470px" }} maxW={{ sm: "100%", md: "470px" }}>
      <Box
        bg="purple.700"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="5px 8px"
        position="relative"
        w="100%"
      >
        {rateGridStore.isLoading && (
          <Box position="absolute" w="100%" h="3px" top="35" left="0">
            <Progress isIndeterminate h="3px" hasStripe />
          </Box>
        )}
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <Icon as={FaList} color="white" mr="10px" />
          <Text color="white">Rate Grid</Text>
        </Box>
        <Box>
          <Button
            variant="solid"
            onClick={handleOpenAllRules}
            size="xs"
            ml="10px"
          >
            Get Rules
          </Button>
          <Button variant="solid" onClick={handleOpen} size="xs" ml="10px">
            Email Rate Grid
          </Button>
          <Button
            variant="solid"
            onClick={() => handleReload()}
            size="xs"
            ml="10px"
          >
            Reload
          </Button>
        </Box>
      </Box>
      <Box p="8px" position="relative" w="100%">
        {rateGridStore.isLoading && (
          <Box
            position="absolute"
            w="100%"
            h="100%"
            top="0"
            left="0"
            bg="blackAlpha.300"
          />
        )}

        <ModalAllRules
          isOpen={openAllRulesModal}
          setIsOpen={setOpenAllRulesModal}
          submission_id={submission_id}
        />

        <Modal isOpen={isOpen} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Send Rate Grid</ModalHeader>
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={emailAddress || ""}
                  onChange={handleEmailAddressChange}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Email Subject</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter email subject"
                  value={emailSubject || { customemailsubj }}
                  onChange={handleEmailSubjectChange}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="solid" onClick={handleSend}>
                Send
              </Button>
              <Button variant="ghost" ml={4} onClick={handleClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <SimpleGrid columns={{ sm: 1, md: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="5px 8px"
            border="1px solid gray"
            minH="30px"
          >
            <Text fontWeight="bold" fontSize="11px">
              RateLTV
            </Text>
            <Text fontSize="11px">{defaultLtv}</Text>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="5px 8px"
            border="1px solid gray"
            minH="30px"
          >
            <Text fontWeight="bold" fontSize="11px">
              RateScore
            </Text>
            <Text fontSize="11px">{defaultscore}</Text>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="5px 8px"
            border="1px solid gray"
            minH="30px"
          >
            <Text fontWeight="bold" fontSize="11px">
              LTVOverride
            </Text>
            <NumberInput
              value={ltv}
              onChange={(nextValue, _) => handleChange(nextValue, "ltv")}
              fontSize="11px"
              width="50px"
              size="xs"
              min={50}
              max={100}
              precision={2}
              textAlign="right"
            >
              <NumberInputField sx={{ textAlign: "right", padding: 1 }} />
            </NumberInput>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="5px 8px"
            border="1px solid gray"
            minH="30px"
          >
            <Text fontWeight="bold" fontSize="11px">
              ScoreOverride
            </Text>
            <NumberInput
              value={score}
              onChange={(nextValue, _) => handleChange(nextValue, "score")}
              fontSize="11px"
              width="50px"
              size="xs"
              min={500}
              max={800}
              ml="8px"
              textAlign="right"
            >
              <NumberInputField sx={{ textAlign: "right", padding: 1 }} />
            </NumberInput>
          </Box>
        </SimpleGrid>
        <TableContainer border="1px solid gray" p="10px">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>
                  <Text fontWeight="bold" fontSize="11px">
                    Hide
                  </Text>
                </Th>
                <Th>
                  <Text>Term</Text>
                </Th>
                <Th>
                  <Text fontWeight="bold" fontSize="11px">
                    Rate
                  </Text>
                </Th>
                <Th>
                  <Text fontWeight="bold" fontSize="11px">
                    Payment
                  </Text>
                </Th>
                <Th>
                  <Text fontWeight="bold" fontSize="11px">
                    PTI
                  </Text>
                </Th>
                <Th>
                  <Text fontWeight="bold" fontSize="11px">
                    Adj
                  </Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {rateGridStore.rateGrid.map((item, index) => {
                return (
                  <Tr
                    key={index}
                    style={{
                      color: hideCheckboxes[index] ? "lightgray" : "black",
                    }}
                  >
                    <Td maxW="10px" whiteSpace="nowrap" textAlign="center">
                      <input
                        type="checkbox"
                        checked={hideCheckboxes[index]}
                        onChange={(e) =>
                          handleActiveChange(index, e.target.checked)
                        }
                      />
                    </Td>
                    <Td maxW="10px" whiteSpace="nowrap">
                      <Text
                        fontSize="11px"
                        fontWeight="bold"
                        textAlign="center"
                      >
                        {item.term}
                      </Text>
                    </Td>
                    <Td maxW="10px" whiteSpace="nowrap">
                      <Text fontSize="11px" fontWeight="bold">
                        {percentFormat(
                          Number(item.rate) * 100 +
                            Number(adjValues[index] || 0)
                        )}
                      </Text>
                    </Td>
                    <Td>
                      <Text
                        fontSize="11px"
                        fontWeight="bold"
                        textAlign="center"
                      >
                        {currFormat(pmtValues[index])}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="11px" fontWeight="bold">
                        {incomeStore.income[0].comb
                          ? percentFormat(
                              Math.round(
                                (pmtValues[index] /
                                  parseFloat(
                                    incomeStore.income[0].comb
                                      .replace("$", "")
                                      .replace(",", "")
                                  )) *
                                  1000
                              ) / 10
                            )
                          : ""}
                      </Text>
                    </Td>
                    <Td maxW="20px" whiteSpace="nowrap" textAlign="center">
                      <input
                        key={index}
                        type="number"
                        defaultValue={0}
                        onChange={(e) => handleAdjChange(index, e.target.value)}
                        style={{
                          display: "block",
                          marginBottom: "10px",
                          width: "40px",
                          textAlign: "right",
                        }}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default RateGridCard;
