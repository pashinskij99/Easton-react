import {
  Icon,
  Box,
  Text,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { FaQuestionCircle, FaList, FaClipboardList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { cloneDeep } from "lodash";
import { borrowerData, coborrowerData, incomeData } from "../../mock";
import { getIncome } from "../../store/income";
import { useEffect, useState } from "react";
//import { termsData } from "../../components/TermsCard/index.js";
import useLocalStorage from './useLocalStorage';
//import { useLocalStorageWatcher } from './useLocalStorageWatcher';

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const useLocalStoragePolling = (key, callback, interval = 500) => {
  useEffect(() => {
    let prevValue = localStorage.getItem(key);

    const checkForChanges = () => {
      const currentValue = localStorage.getItem(key);
      if (currentValue !== prevValue) {
        prevValue = currentValue;
        callback(currentValue);
      }
    };

    const intervalId = setInterval(checkForChanges, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [key, callback, interval]);
};

const IncomeCard = ({ paymentValue }) => {
  const borrowerStore = useSelector((state) => state.borrower);
  const coborrowerStore = useSelector((state) => state.borrower.coborrower);
  const termsStore = useSelector((state) => state.borrower.contract);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [computedItems, setComputedItems] = useState([]); // Add this state

  const savedApplication = JSON.parse(window.localStorage.getItem("ApplicationLS"));

  const itemsFromStorage = JSON.parse(localStorage.getItem("IncomeLS") || "[]");
  const [storedItems, setStoredItems] = useState(itemsFromStorage);
  const [storedTerms, setStoredTerms] = useLocalStorage("TermsLS", []);
  const [mthlypmt, setmthlypmt] = useState(0);

useEffect(() => {
  const updatedmthlypmt = parseFloat(storedTerms[5]?.value || 0);
  setmthlypmt(updatedmthlypmt);
}, [storedTerms]);


useLocalStoragePolling("TermsLS", (newValue) => {
  const updatedTerms = JSON.parse(newValue || "[]");
  setStoredTerms(updatedTerms);
  const updatedmthlypmt = parseFloat(updatedTerms[5]?.value || 0);
  setmthlypmt(updatedmthlypmt);
});


  useEffect(() => {
    // Dispatch the action when computedItems state changes
    dispatch(
      getIncome({
        income: computedItems,
      })
    );
    localStorage.setItem("IncomeLS", JSON.stringify(storedItems));
  }, [computedItems, dispatch, storedTerms, mthlypmt]); 
  
//  useEffect(() => {
//    dispatch(getIncome());
//  }, [dispatch, mthlypmt, storedItems]);

  const items = useMemo(() => {
    if (borrowerStore.all.length > 0) {
      const borrowerInfo = borrowerStore.all[0].borrower;
      const coborrowerInfo = borrowerStore.all[1].coborrower;  
  
      const mthlypmt = parseFloat(storedTerms.find(item => item.label === 'Payment')?.value || 0);      var borInc = borrowerInfo?.income;
      borInc = typeof borInc === 'number' ? borInc : 0;
      var rentmtgebor = borrowerInfo?.rentmtge;
      rentmtgebor = typeof rentmtgebor === 'number' ? rentmtgebor : 0;
      var debtbor = borrowerInfo?.debt
      debtbor = typeof debtbor === 'number' ? debtbor : 0;
      var coInc = coborrowerInfo?.income;
      coInc = typeof coInc === 'number' ? coInc : 0;
      var rentmtgeco = coborrowerInfo?.rentmtge;
      rentmtgeco = typeof rentmtgeco === 'number' ? rentmtgeco : 0;
      var debtco = coborrowerInfo?.debt
      debtco = typeof debtco === 'number' ? debtco : 0;

      let finalItems = cloneDeep(incomeData);
      finalItems[0].borrower = borInc ? currencyFormatter.format(borInc) : borInc
      finalItems[0].comb = currencyFormatter.format(borInc + coInc);

      finalItems[1].borrower = rentmtgebor ? currencyFormatter.format(rentmtgebor) : rentmtgebor;      
      finalItems[1].co = rentmtgeco ? currencyFormatter.format(rentmtgeco) : rentmtgeco;
      finalItems[1].comb = currencyFormatter.format(rentmtgebor + rentmtgeco);

      finalItems[2].borrower = debtbor ? currencyFormatter.format(debtbor) : debtbor;
      finalItems[2].comb = currencyFormatter.format(debtbor + debtco)
  
      finalItems[4].borrower = currencyFormatter.format(borInc- rentmtgebor- debtbor);
      finalItems[4].comb = currencyFormatter.format(borInc+coInc-rentmtgebor-rentmtgeco-debtbor-debtco);      

      finalItems[5].borrower = Math.round(((rentmtgebor+ debtbor+mthlypmt)/borInc)*10000)/100+"%";
      finalItems[5].comb = Math.round(((rentmtgeco+rentmtgebor+debtco+debtbor+mthlypmt)/(borInc+coInc))*10000)/100 +"%";      

      finalItems[6].borrower = Math.round((mthlypmt/borInc)*10000)/100+"%";
      finalItems[6].comb = Math.round((mthlypmt/(borInc+coInc))*10000)/100+"%";      

      if (coInc===0) {
        finalItems[0].co = ''
        finalItems[1].co = ''
        finalItems[2].co = ''
        finalItems[4].co = ''
        finalItems[5].co = ''
        finalItems[6].co = ''
      } else {
        finalItems[0].co = coInc ? currencyFormatter.format(coInc) : coInc;
        finalItems[2].co = debtco ? currencyFormatter.format(debtco) : debtco;
        finalItems[4].co = currencyFormatter.format(coInc- rentmtgeco- debtco);
        finalItems[5].co = Math.round(((rentmtgeco+ debtco+mthlypmt)/coInc)*10000)/100 +"%";
        finalItems[6].co = Math.round((mthlypmt/coInc)*10000)/100+"%";
      }
    setComputedItems(finalItems); // Update the state with finalItems
    return finalItems;
  }
  setComputedItems(incomeData); // Update the state with incomeData
  return incomeData;
}, [borrowerStore, storedTerms, mthlypmt]);

  return (
    <Box minW={{ sm: "100%", md: "420px" }} maxW={{ sm: "100%", md: "420px" }}>
      <Box
        bg="pink.700"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="5px 8px"
        w="100%"
      >
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <Icon as={FaList} color="white" mr="10px" />
          <Text color="white">Income</Text>
        </Box>
        {/* <Box>
          <IconButton
            size="xs"
            variant="outline"
            icon={<Icon as={FaClipboardList} color="white" w="10px" h="10px" />}
          />
        </Box> */}
      </Box>
      <Box p="8px" w="100%">
        <TableContainer>
          <Table variant="simple" size="xs">
            <Thead>
              <Tr>
                <Th>
                </Th>
                <Th>
                  <Text fontWeight="bold" fontSize="11px">
                    Borrower
                  </Text>
                </Th>
                <Th>
                  <Text fontWeight="bold" fontSize="11px">
                    Co
                  </Text>
                </Th>
                <Th>
                  <Text fontWeight="bold" fontSize="11px">
                    Comb
                  </Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item, index) => (
                <Tr key={index}>
                  <Td>
                    <Text fontSize="11px" fontWeight="bold">
                      {item.label}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="11px" >
                      {item.borrower}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="11px" >
                      {item.co}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="11px" fontWeight="bold">
                      {item.comb}
                    </Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default IncomeCard;
