import {
  Icon,
  Box,
  Text,
  IconButton,
  SimpleGrid,
  Progress,
} from "@chakra-ui/react";
import "core-js/features/url-search-params";
import { useState } from "react";
import { FaQuestionCircle, FaList, FaClipboardList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getPopupDetails } from "../../store/popup";
import ContentModal from "../ContentModal";
//import url from 'url';
import 'url-search-params-polyfill';
//const { URLSearchParams } = url;

/**
 * Props for BorrowerCard component.
 * @typedef {Object} BorrowerCardProps
 * @property {boolean} isOpen - Determines whether the modal is open or closed.
 * @property {function} handleClose - Callback function to handle closing the modal.
 */

/**
 * @param {BorrowerCardProps} props - Component props
 */

const BorrowerCard = () => {
  const borrowerStore = useSelector((state) => state.borrower);
  //  const popupStore = useSelector((state) => state.popup);
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();

  /**
   * Callback function to open the popup modal and fetch popup details.
   * Dispatches an action to fetch popup details and sets the modalOpen state to true.
   * @function
   */
  const handleShowPopup = () => {
    const payload = {
      submission_id: borrowerStore.submission_id,
      borrtype: "primary",
      date: new Date(),
    };
    const queryString = Object.keys(payload)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`)
      .join('&');
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: queryString,
    };
    dispatch(getPopupDetails(requestOptions));
    setModalOpen(true);
  };

  /**
 * Callback function to close the popup modal.
 * Sets the modalOpen state to false.
 * @function
 */
  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Box minW={{ sm: "100%", md: "420px" }} maxW={{ sm: "100%", md: "420px" }}>
      <Box
        bg="red.700"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="5px 8px"
        position="relative"
        w="100%"
      >
        {borrowerStore.isLoading && (
          <Box position="absolute" w="100%" h="3px" top="35px" left="0">
            <Progress isIndeterminate h="3px" hasStripe />
          </Box>
        )}
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <Icon as={FaList} color="white" mr="10px" />
          <Text color="white">Borrower</Text>
        </Box>
        <Box>
          <IconButton
            size="xs"
            variant="outline"
            icon={<Icon as={FaClipboardList} color="white" w="10px" h="10px" />}
            onClick={() => handleShowPopup()}
          />
        </Box>
      </Box>
      <Box w="100%">
        <SimpleGrid columns={{ sm: 2, md: 2 }} p="8px">
          {borrowerStore.borrower.length > 0 &&
            borrowerStore.borrower
              .filter((item) => item.label !== "SSN" && item.label !== "Debt" && item.label !== "ZipCode")
              .map((item, index) => (
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
                  <Text fontSize="11px" maxW="120px" ml="10px" textAlign="right">
                    {(item.label === "Income" || item.label === "Total_Income" || item.label === "RentMtge") ? `$${!isNaN(parseFloat(item.value)) ? parseFloat(item.value).toLocaleString() : 0}` : item.value}
                  </Text>
                </Box>
              ))}
        </SimpleGrid>
      </Box>
      <ContentModal
        isOpen={modalOpen}
        handleClose={handleModalClose}
        modalStyle={{
          maxW: "100%",
          mx: "auto",
          minH: "100vh",
          padding: { base: "20px", md: "40px" }
        }}
      />
    </Box>
  );
};

export default BorrowerCard;
