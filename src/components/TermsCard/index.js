import {
  Box,
  Text,
  Button,
  Icon,
  IconButton,
  SimpleGrid,
  Input,
  Progress,
} from "@chakra-ui/react";

import { useMemo, useState, useEffect } from "react";
import { FaQuestionCircle, FaList, FaClipboardList } from "react-icons/fa";
import { useSelector } from "react-redux";
import { cloneDeep, isEmpty } from "lodash";
import axios from "axios"


const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currFormat = (val) => {
  if (typeof val !== 'string') {
    val = String(val);
  }
  return `$` + val.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  const currParse = (val) => {
    if (typeof val !== 'string') {
      val = String(val);
    }
    return val.replace(/^\$/, '');
  }
  const percentFormat = (val) => val.toLocaleString(undefined, { maximumFractionDigits: 4 })+'%'
  const percentParse = (val) => {
    if (typeof val !== 'string') {
      val = String(val);
    }
    return val.replace(/\%/, '');
  }
  
const TermsCard = () => {
  const borrowerStore = useSelector((state) => state.borrower);
  const rateGrid = useSelector((state) => state.rateGrid);
  const [contractdate, setcontractDate] = useState(new Date());
  const firstPaymentDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 40);
    return date;
  }, []);
  const selectRateGridRate = (state) => state.rateGrid.rateGrid[3]?.rate;
  const selectRateGridTerm = (state) => state.rateGrid.rateGrid[3]?.term;
  const selectAmountToFinance = (state) => state.borrower.all[2]?.amounttofinance;
  const rate = useSelector((state) => selectRateGridRate(state));
  const term = useSelector((state) => selectRateGridTerm(state));
  const financeAmount = useSelector((state) => selectAmountToFinance(state));
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(createFinalItems(rate, term, financeAmount, contractdate, firstPaymentDate));
  }, [rate, term, financeAmount, contractdate, firstPaymentDate]);

  const createFinalItems = (rate, term, financeAmount, contractdate, firstPaymentDate) => {
    return [
      { name: 'Rate', value: rate || 'N/A' },
      { name: 'Term', value: term || 'N/A' },
      { name: 'Amount Financed', value: financeAmount ? `$${financeAmount}` : 'N/A' },
      { name: 'Contract Date', value: contractdate ? contractdate.toLocaleDateString() : 'N/A' },
      { name: 'First Payment Date', value: firstPaymentDate ? firstPaymentDate.toLocaleDateString() : 'N/A' },
    ];
  };
  
  const handleValueChange = (name, nextValue) => {
    const updatedItems = items.map((i) => {
      if (i.name === name) {
        return { ...i, value: String(nextValue) };
      }
      return i;
    });
    setItems(updatedItems);
  };
  

  const handleSave = () => {
    // prepare the data to send to the API
    const data = {};
    items.forEach((item) => {
      data[item.name.replace(/\s/g, "").toLowerCase()] = item.value;
    });
    // send the data to the API
    fetch("http://eastontj.ddns.net:7000/LOSupdate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // handle the response from the API
      })
      .catch((error) => {
        // handle the error from the API
      });
  };

    const calculatePaymentAmount = (rate, term, financeAmount, firstPaymentDate, contract_dt) => {
      var loan_b1 = financeAmount
        var rate_b2 = rate;
        var term_b3 = term
        var accruedt_b4 = contract_dt
        var pmtdt_b5 = firstPaymentDate 
    
        //Daily Effective Interest Rate
        var dlyrt = (1+rate_b2/12)**(12/365)-1
        //Odd Interest Period (Days)
        var odddays = Math.floor((pmtdt_b5 - accruedt_b4) / (1000 * 60 * 60 * 24)) - 30;
        //Interest for Odd Period
        var oddint = loan_b1*(1+dlyrt)**odddays-loan_b1
        //Amount to be Financed
        var amtfin =loan_b1*(1+dlyrt)**odddays
        //Monthly Payments
        var prec_pmt = Math.round((((rate_b2/1200)+(rate_b2/1200)/((1+(rate_b2/1200))**(term_b3*12)-1))*loan_b1)*100)/100
      return prec_pmt;
    };

    
    return (
      <Box>
        <Box
          bg="blue.700"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding="5px 8px"
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
        <Box p="8px">
        <SimpleGrid columns={{ sm: 1, md: 2 }}>
          {items.map((item, index) => (
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
                {item.name}
              </Text>
              <Input
                size="sm"
                value={item.value}
                onChange={(e) => handleValueChange(item.name, e.target.value)}
                maxW="120px"
                ml="10px"
              />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default TermsCard;