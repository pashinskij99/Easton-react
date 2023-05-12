import { Tbody, Thead, Tr, Th, Td, Table } from "@chakra-ui/react";
import React from "react";

const AllRulesTable = ({ allRulesData }) => {

  const headerTabs = Object.keys(allRulesData[0]);

  return (
    <Table
      size="sm"
      variant="striped"
      colorScheme="gray"
    >
      <Thead>
        <Tr>
          {headerTabs?.map((item) => (
            <Th className="!text-center text-sm">{item}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {allRulesData?.map((item) => (
          <Tr >
            {Object.values(item).map((value) => (
              <Td className="!text-center text-sm">{value}</Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default AllRulesTable;
