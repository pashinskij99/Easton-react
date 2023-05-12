import {
  Icon,
  Box,
  Text,
  Button,
  IconButton,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  Progress,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMemo, useEffect, useState } from "react";
import { FaQuestionCircle, FaList, FaClipboardList } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { cloneDeep, isEmpty, debounce } from "lodash";
import { contractData, termsData } from "../../mock";
import VehicleCard from "../VehicleCard/index";
import { useWindowSize } from "react-use";

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

const ContractCard = ({ paymentValueProp, setPaymentValueProp }) => {
  const borrowerStore = useSelector((state) => state.borrower);
  const [contractItems, setcontractItems] = useState(() => {
    const finalcontractItems = cloneDeep(contractData);
    // set the value of the items if available from the store
    if (borrowerStore.all.length > 0 && !isEmpty(borrowerStore.all[2])) {
      const contractInfo = borrowerStore.all[2].contract;
      const keys = Object.keys(contractInfo);
      keys.forEach((key) => {
        const targetItem = finalcontractItems.find(
          (item) => item.label.replace(/\s/g, "").toLowerCase() === key
        );
        if (targetItem) {
          targetItem.value = contractInfo[key] || 0;
        }
      });
    }
    finalcontractItems.push({
      label: "Final Due Date",
      value: null,
      color: "black",
      editable: false,
    });
    return finalcontractItems;
  });

  const [payment, setPayment] = useState(0);
  useEffect(() => {
    if (paymentValueProp !== payment) {
      setPaymentValueProp(payment);
    }
  }, [payment, paymentValueProp, setPaymentValueProp]);

  const rateGrid = useSelector((state) => state.rateGrid);
  const [contractdate, setcontractDate] = useState(new Date());
  const itemsFromStorage = JSON.parse(localStorage.getItem("income") || "[]");
  const [storedItems, setStoredItems] = useState(itemsFromStorage);

  const firstPaymentDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 40);
    return date;
  }, []);

  useEffect(() => {}, [
    borrowerStore,
    rateGrid,
    contractdate,
    firstPaymentDate,
    borrowerStore.all[2]?.amounttofinance,
  ]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "vehicleInfoTD[3]" && e.newValue) {
        const newVehicleInfo = JSON.parse(e.newValue);
        if (
          newVehicleInfo &&
          newVehicleInfo[3] &&
          newVehicleInfo[3].dealerValue
        ) {
          contractItems.find(
            (item) => item.label === "Amount to Finance"
          ).value = newVehicleInfo;
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleValueChange = (label, nextValue, recalculate) => {
    const updatedContractItems = contractItems.map((i) => {
      if (i.label === label) {
        // Convert the nextValue to a number if it's a string
        const newValue =
          typeof nextValue === "string" ? parseFloat(nextValue) : nextValue;
        return { ...i, value: newValue };
      }
      return i;
    });
    setcontractItems(updatedContractItems);
    if (recalculate) {
      recalculateDates();
      recalculateAmountToFinance(updatedContractItems);
    }
    const updatedTermsItems = termsItems.map((i) => {
      if (i.label === label) {
        return { ...i, value: nextValue };
      }
      return i;
    });
    setTermsItems(updatedTermsItems);
    saveToLocalStorage(updatedContractItems, updatedTermsItems);
  };
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  // const formatDate = (date) => {
  //   const formattedDate = new Date(date);
  //   return `${formattedDate.getFullYear()}-${String(formattedDate.getMonth() + 1).padStart(2, '0')}-${String(formattedDate.getDate()).padStart(2, '0')}`;
  // };

  const handleSave = () => {
    var data = {};
    const storedAppDataString = localStorage.getItem("ApplicationLS");
    const storedTermsDataString = localStorage.getItem("TermsLS");

    // Parse the local storage items into JavaScript objects
    const storedAppData = storedAppDataString
      ? JSON.parse(storedAppDataString)
      : {};
    const storedTermsData = storedTermsDataString
      ? JSON.parse(storedTermsDataString)
      : {};

    contractItems.forEach((item) => {
      data[item.label.replace(/\s/g, "").toLowerCase()] = currParse(item.value);
    });

    // Add local storage items to the data object
    data = {
      ...data,
      ...storedAppData,
      ...storedTermsData,
    };

    data.action_type = "upContract";
    fetch("http://eastontj.ddns.net:7000/LOSupdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          alert("Data saved successfully");
        }
      })
      .catch((error) => {
        alert("Error saving data: " + error.message);
      });
  };

  const updateItemsFromBorrowerStore = (items) => {
    if (borrowerStore.all.length > 0 && !isEmpty(borrowerStore.all[2])) {
      const contractInfo = borrowerStore.all[2].contract;
      const keys = Object.keys(contractInfo);
      keys.forEach((key) => {
        const targetItem = items.find(
          (item) => item.label.replace(/\s/g, "").toLowerCase() === key
        );
        if (targetItem) {
          targetItem.value = contractInfo[key] || 0;
        }
      });
    }
  };

  const recalculateDates = () => {
    const updatedContractDate = formatDate(
      termsItems.find((item) => item.label === "Contract Date")?.value ||
        new Date()
    );
    const updatedTerm = termsItems.find((item) => item.label === "Term")?.value;
    const updatedFinalDueDate = new Date(updatedContractDate);
    updatedFinalDueDate.setMonth(
      updatedFinalDueDate.getMonth() + parseInt(updatedTerm)
    );
    const updatedAmountToFinance =
      contractItems.find((item) => item.label === "Amount to Finance")?.value ||
      0;
    const updatedContractRate =
      termsItems.find((item) => item.label === "Contract Rate")?.value || 0;
    const updatedPayment = calculate_payment(
      updatedAmountToFinance,
      updatedContractRate,
      updatedTerm,
      updatedContractDate,
      firstPaymentDate
    );
    setPayment(updatedPayment);
    setTermsItems((prevState) =>
      prevState.map((item) => {
        if (item.label === "Final Due Date") {
          return { ...item, value: updatedFinalDueDate };
        } else if (item.label === "Payment") {
          return { ...item, value: updatedPayment };
        }
        return item;
      })
    );
    setcontractItems((prevState) =>
      prevState.map((item) => {
        if (item.label === "Final Due Date") {
          return { ...item, value: updatedFinalDueDate };
        }
        return item;
      })
    );
  };

  function calculate_payment(amt, rate, term, contractdate, firstpmtdate) {
    const loan_b1 = parseFloat(amt);
    const rate_b2 = parseFloat(rate) / 100;
    const rate_b2a = rate_b2 / 12;
    const term_b3 = parseFloat(term);
    const accruedt_b4 = new Date(contractdate);
    const pmtdt_b5 = new Date(firstpmtdate);
    // Subtract the two date objects, and the result is in milliseconds
    const diffMilliseconds = parseFloat(pmtdt_b5 - accruedt_b4);

    // Convert the difference from milliseconds to days
    const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24);

    // Round the result to get the difference in days
    const roundedDays = Math.round(diffDays, 0);

    //Daily Effective Interest Rate
    const dlyrt = (1 + rate_b2a) ** (12 / 365) - 1;
    //Odd Interest Period (Days)
    const odddays = Math.round(roundedDays - 30, 0);

    //Interest for Odd Period
    const oddint = loan_b1 * (1 + dlyrt) ** odddays - loan_b1;
    //Amount to be Financed
    const amtfin = loan_b1 * (1 + dlyrt) ** odddays;
    //Monthly Payments
    const prec_pmt =
      Math.round(
        (rate_b2 / 12 + rate_b2 / 12 / ((1 + rate_b2 / 12) ** term_b3 - 1)) *
          loan_b1 *
          100
      ) / 100;
    return prec_pmt;
  }

  useEffect(() => {
    const updatedContractItems = cloneDeep(contractData);
    updateItemsFromBorrowerStore(updatedContractItems);
    setcontractItems(updatedContractItems);
    const updatedTermsItems = cloneDeep(termsData);
    updateItemsFromBorrowerStore(updatedTermsItems);
    updatedTermsItems.forEach((item) => {
      item.editable = [
        "Contract Rate",
        "Term",
        "Contract Date",
        "First Pmt Date",
      ].includes(item.label);
    });
    setTermsItems(updatedTermsItems);
  }, [borrowerStore]);

  const [termsItems, setTermsItems] = useState(() => {
    const finalTermsItems = cloneDeep(termsData);
    finalTermsItems.forEach((item) => {
      item.editable = [
        "Contract Rate",
        "Term",
        "Contract Date",
        "First Pmt Date",
      ].includes(item.label);
    });

    if (borrowerStore.all.length > 0 && !isEmpty(borrowerStore.all[2])) {
      const contractInfo = borrowerStore.all[2].contract;
      const keys = Object.keys(contractInfo);
      keys.forEach((key) => {
        const targetItem = finalTermsItems.find(
          (item) => item.label.replace(/\s/g, "").toLowerCase() === key
        );
        if (targetItem) {
          targetItem.value = contractInfo[key] || 0;
        }
      });
    }
    return finalTermsItems;
  });

  const saveToLocalStorage = debounce((contractItems, termsItems) => {
    const termsData = JSON.stringify(termsItems);
    const contractData = JSON.stringify(contractItems);
    localStorage.setItem("TermsLS", termsData);
    localStorage.setItem("ContractLS", contractData);
  }, 300);

  useEffect(() => {
    saveToLocalStorage(contractItems, termsItems);
  }, [contractItems, termsItems]);

  useEffect(() => {
    recalculateDates();
  }, [
    termsItems.find((item) => item.label === "Contract Rate")?.value,
    termsItems.find((item) => item.label === "Term")?.value,
    termsItems.find((item) => item.label === "Contract Date")?.value,
    termsItems.find((item) => item.label === "First Pmt Date")?.value,
    contractItems.find((item) => item.label === "Amount to Finance")?.value,
  ]);

  const renderValue = (item) => {
    if (item.label === "Contract Rate") {
      return percentFormat(parseFloat(item.value) / 100);
    } else if (item.label === "Term") {
      return item.value;
    } else if (
      item.label === "Contract Date" ||
      item.label === "First Pmt Date" ||
      item.label === "Final Due Date"
    ) {
      return item.value && !isNaN(new Date(item.value))
        ? formatDate(new Date(item.value))
        : "";
    } else {
      return currFormat(parseFloat(item.value));
    }
  };

  const recalculateStampTax = (updatedContractItems) => {
    var downPaymentCalc =
      parseFloat(
        updatedContractItems.find((item) => item.label === "Down Payment")
          ?.value
      ) || 0;
    var rebateCalc =
      parseFloat(
        updatedContractItems.find((item) => item.label === "Rebate")?.value
      ) || 0;
    var tradeInAllowanceCalc =
      parseFloat(
        updatedContractItems.find((item) => item.label === "Trade In Allowance")
          ?.value
      ) || 0;
    var oldamttofinCalc =
      parseFloat(
        updatedContractItems.find((item) => item.label === "Amount to Finance")
          ?.value
      ) || 0;
    let total = 0;
    updatedContractItems.forEach((item) => {
      if (
        item.label !== "Florida Stamp Tax" ||
        item.label !== "Amount to Finance" ||
        item.label !== "Rebate" ||
        item.label !== "Down Payment" ||
        item.label !== "Trade In Allowance"
      ) {
        total += parseFloat(item.value) || 0;
      }
    });
    total = parseFloat(total);
    var subt =
      downPaymentCalc + rebateCalc + tradeInAllowanceCalc + oldamttofinCalc;
    var amtStampTax = Math.round((total - subt) * 0.0037 * 100) / 100;
    console.log("state =:", borrowerStore.all[0].borrower.state);
    if (borrowerStore.all[0].borrower.state !== "FL") {
      amtStampTax = 0;
    }
    console.log("stamptax:", amtStampTax);
    const newContractItems = updatedContractItems.map((item) => {
      if (item.label === "Florida Stamp Tax") {
        const updatedItem = { ...item, value: amtStampTax };
        return updatedItem;
      }
      return item;
    });
    return newContractItems;
  };

  const recalculateAmountToFinance = (updatedContractItems) => {
    // Call recalculateStampTax and get the updated contract items with Florida Stamp Tax value
    const updatedContractItemsWithStampTax =
      recalculateStampTax(updatedContractItems);

    var downPaymentCalc =
      parseFloat(
        updatedContractItemsWithStampTax.find(
          (item) => item.label === "Down Payment"
        )?.value
      ) || 0;
    var rebateCalc =
      parseFloat(
        updatedContractItemsWithStampTax.find((item) => item.label === "Rebate")
          ?.value
      ) || 0;
    var tradeInAllowanceCalc =
      parseFloat(
        updatedContractItemsWithStampTax.find(
          (item) => item.label === "Trade In Allowance"
        )?.value
      ) || 0;
    var floridaStampTaxCalc =
      parseFloat(
        updatedContractItemsWithStampTax.find(
          (item) => item.label === "Florida Stamp Tax"
        )?.value
      ) || 0;

    let total = 0;
    updatedContractItemsWithStampTax.forEach((item) => {
      if (
        item.label !== "Amount to Finance" &&
        item.label !== "Rebate" &&
        item.label !== "Down Payment" &&
        item.label !== "Trade In Allowance" &&
        item.label !== "Florida Stamp Tax"
      ) {
        total += parseFloat(item.value) || 0;
      }
    });

    total = parseFloat(total);
    total += floridaStampTaxCalc; // Add Florida Stamp Tax to the total
    var subt = 1 * (downPaymentCalc + rebateCalc + tradeInAllowanceCalc);
    var amountToFinance = total - subt;

    const newContractItems = updatedContractItemsWithStampTax.map((item) => {
      if (item.label === "Amount to Finance") {
        const updatedItem = { ...item, value: amountToFinance };
        return updatedItem;
      }
      return item;
    });

    setcontractItems(newContractItems);
  };

  useEffect(() => {
    const updatedAmountToFinance =
      contractItems.find((item) => item.label === "Amount to Finance")?.value ||
      0;
    const updatedContractRate =
      termsItems.find((item) => item.label === "Contract Rate")?.value || -999;
    const updatedTerm = termsItems.find((item) => item.label === "Term")?.value;
    const updatedContractDate = formatDate(
      termsItems.find((item) => item.label === "Contract Date")?.value ||
        new Date()
    );
    const updatedFirstPaymentDate =
      termsItems.find((item) => item.label === "First Pmt Date")?.value ||
      firstPaymentDate;
    const updatedPayment = calculate_payment(
      updatedAmountToFinance,
      updatedContractRate,
      updatedTerm,
      updatedContractDate,
      updatedFirstPaymentDate
    );
    setPayment(updatedPayment);
  }, [contractItems, termsItems]);

  const updateTotalCashPrice = (newTotalCashPrice) => {
    const updatedContractItems = contractItems.map((item) => {
      if (item.label === "Total Cash Price") {
        return { ...item, value: newTotalCashPrice };
      }
      return item;
    });
    setcontractItems(updatedContractItems);
  };

  const renderInput = (item) => {
    if (
      item.label === "Contract Date" ||
      item.label === "First Pmt Date" ||
      item.label === "Final Due Date"
    ) {
      return (
        <input
          type="date"
          // value={item.value ? formatDate(new Date(item.value)) : ""}
          value={
            item.value ? new Date(item.value).toISOString().slice(0, 10) : ""
          }
          onChange={(event) =>
            handleValueChange(item.label, event.target.value, true)
          }
          style={{
            inputFormat: "yyyy-MM-dd",
            fontSize: "11px",
            maxWidth: "80px",
            maxHeight: "15px",
            marginLeft: "10px",
            textAlign: "right",
            marginRight: "5px",
          }}
        />
      );
    } else if (item.label === "Term") {
      return (
        <input
          value={item.value ? parseInt(item.value) : ""}
          onChange={(event) =>
            handleValueChange(item.label, event.target.value, true)
          }
          style={{
            fontSize: "11px",
            maxWidth: "80px",
            maxHeight: "15px",
            marginLeft: "1px",
            textAlign: "right",
            marginRight: "5px",
          }}
        />
      );
    } else {
      return (
        <Input
          value={item.value}
          onChange={(event) =>
            handleValueChange(item.label, event.target.value, true)
          }
          fontSize="11px"
          maxWidth="80px"
          size="xs"
          ml="20px"
          maxHeight="15px"
          color={item.color}
        />
      );
    }
  };

  const { width } = useWindowSize()
  
  let termsItemsHalf = Math.floor(termsItems.length / 2)
  let contractItemsHalf = Math.floor(contractItems.length / 2)

  return (
    <>
      <Box>
        {/* Terms section */}
        <Box
          bg="blue.700"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="3px 8px"
          position="relative"
        >
          {borrowerStore.isLoading && (
            <Box position="absolute" w="100%" h="3px" top="35" left="0">
              <Progress isIndeterminate h="3px" hasStripe />
            </Box>
          )}
          <Box display="flex" alignItems="center" justifyContent="flex-start">
            <Icon as={FaList} color="white" mr="10px" />
            <Text color="white">Terms</Text>
          </Box>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            size="sm"
            rightIcon={<FaClipboardList />}
          >
            Save
          </Button>
        </Box>
        <Box p="3px">
          <SimpleGrid columns={{ sm: 1, md: 2 }}>
            {termsItems.map((item, index) => {
              const checkEven = (index + 1) % 2 === 0
              return (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  padding="3px 3px"
                  key={index}
                  style={
                    width <= 767 
                    ? checkEven 
                      ? {order: termsItemsHalf++}
                      : null
                    : null
                  }
                  minH="10px"
                  textAlign="right"
                >
                  <Text fontWeight="bold" fontSize="11px">
                    {item.label}
                  </Text>
                  {item.editable ? (
                    item.editable ? (
                      renderInput(item)
                    ) : (
                      item
                    )
                  ) : (
                    <Text
                      fontSize="11px"
                      fontWeight={item.isBold ? "bold" : "normal"}
                      color={item.color}
                      maxW="80px"
                      maxHeight="15px"
                      ml="5px"
                      textAlign="right"
                    >
                      {renderValue(item)}
                    </Text>
                  )}
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Box>
      <Box>
        <Box
          bg="green.700"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="2px 8px"
          position="relative"
        >
          {borrowerStore.isLoading && (
            <Box position="absolute" w="100%" h="2px" top="35" left="0">
              <Progress isIndeterminate h="3px" hasStripe />
            </Box>
          )}
          <Box display="flex" alignItems="center" justifyContent="flex-start">
            <Icon as={FaList} color="white" mr="10px" />
            <Text color="white">Contract</Text>
          </Box>
        </Box>
        <Box p="8px">
          <SimpleGrid columns={{ sm: 1, md: 2 }}>
            {contractItems.map((item, index) => {

              const checkEven = (index + 1) % 2 === 0

              return (
              <Box
                display="flex"
                fontSize="10px"
                alignItems="center"
                justifyContent="space-between"
                padding="3px 3px"
                key={index}
                style={
                  width <= 767 
                  ? checkEven 
                    ? {order: contractItemsHalf++}
                    : null
                  : null
                }
                className={width <= 767 && !item.label ? '!hidden' : ''}
                minH="5px"
                maxHeight="25px"
                textAlign="right"
              >
                <Text fontWeight="bold" fontSize="10px">
                  {item.label}
                </Text>
                {item.editable ? (
                  <NumberInput
                    value={currFormat(item.value)}
                    onChange={(nextValue) =>
                      handleValueChange(item.label, currParse(nextValue), true)
                    }
                    padding="0px"
                    fontSize="10px"
                    maxWidth="90px"
                    size="xs"
                    precision={2}
                    ml="2px"
                    mr="0px"
                    color={item.color}
                  >
                    <NumberInputField
                      style={{ paddingRight: 2, textAlign: "right" }}
                    />
                  </NumberInput>
                ) : (
                  <Text
                    fontSize="12px"
                    fontWeight={item.isBold ? "bold" : "bold"}
                    color={item.color}
                    maxW="80px"
                    ml="5px"
                    textAlign="right"
                  >
                    {item.label !== "" ? renderValue(item) : item.value}
                  </Text>
                )}
              </Box>
            )})}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
};

export default ContractCard;
