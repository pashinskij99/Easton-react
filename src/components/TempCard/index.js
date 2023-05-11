import {
  Icon,
  Box,
  Text,
  IconButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import {
  FaQuestionCircle,
  FaList,
  FaClipboardList,
  FaEdgeLegacy,
  FaCheckCircle,
  FaUserAlt,
  FaCuttlefish,
} from "react-icons/fa";

const TempCard = () => {
  return (
    <Box>
      <Box
        bg="#4c4e53"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="5px 8px"
      >
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <Icon as={FaList} color="white" mr="10px" />
          <Text className="text-white">Borrower</Text>
          <Icon
            as={FaQuestionCircle}
            color="white"
            ml="5px"
            w="10px"
            h="10px"
          />
        </Box>
        <Box>
          <IconButton
            size="xs"
            variant="outline"
            icon={<Icon as={FaClipboardList} color="white" w="10px" h="10px" />}
          />
        </Box>
      </Box>
      <Box>
        <TableContainer>
          <Table variant="simple" size="xs">
            <Thead>
              <Tr>
                <Th>
                  <Text fontWeight="bold"></Text>
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
                  <Text fontWeight="light" fontSize="11px">
                    Comb
                  </Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    Total Income
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    $100,000
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    $10,000
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    $110,000
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    Own
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    $4,500
                  </Text>
                </Td>
                <Td></Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    $4,500
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    Debt
                  </Text>
                </Td>
                <Td></Td>
                <Td></Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    $0
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    Debt
                  </Text>
                </Td>
                <Td></Td>
                <Td></Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    $0
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    Borrower
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    Co
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    Comb
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    DispIncome
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    $95,500
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    $10,000
                  </Text>
                </Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    $105,500
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    CurrDTI
                  </Text>
                </Td>
                <Td></Td>
                <Td></Td>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    0.00%
                  </Text>
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="11px" fontWeight="bold">
                    CurrPTI
                  </Text>
                </Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default TempCard;
