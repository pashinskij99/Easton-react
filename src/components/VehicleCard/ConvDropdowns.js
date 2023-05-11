import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FormControl,
  FormLabel,
  Select,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";

const ConvDropdowns = ({
  selectedConvManu,
  setSelectedConvManu,
  handleInputBlur,
}) => {
  const [convModelOptions, setConvModelOptions] = useState([]);
  const ConvManuRef = useRef();
  const ConvModelRef = useRef();
  const [prevConvModelValue, setPrevConvModelValue] = useState(null);

  useEffect(() => {
    setConvModelOptions(getConvModelOptions());
  }, [selectedConvManu]);

  useEffect(() => {
    if (ConvModelRef.current && prevConvModelValue !== null) {
      ConvModelRef.current.value = prevConvModelValue;
    }
  }, [selectedConvManu, prevConvModelValue]);

  const getConvModelOptions = useCallback(() => {
    const convModels = {
      Braun: [
        "Century",
        "Millenium",
        "Power XT Chrysler",
        "Power XT Toyota",
        "RampVan",
        "RearEntry",
        "SideEntry Chrysler",
        "SideEntry Foldout",
        "SideEntry Honda",
        "SideEntry Traverse",
        "ULV",
        "XI",
        "Other",
      ],
      VMI: [
        "Apex",
        "Northstar",
        "Northstar E",
        "RearEntry",
        "Summit",
        "Verge II E",
        "Other",
      ],
      AMS: ["Edge", "Epic", "Exodus II", "Galaxy", "Legend", "Other"],
      Freedom: ["Other"],
      "Acadiana Handicap Solutions": ["Other"],
      "Adaptive Vans": ["Other"],
      "Advance Mobility Plus": ["Other"],
      "Advanced Modifications, Inc.": ["Other"],
      "ATC: All-Terrain Conversions": ["Other"],
      "ARBOC Specialty Vehicles LLC": ["Other"],
      "ATS: Asstd. Trans. Sys, & Wilkerson": ["Other"],
      "Custom Van Conversions & Mobility": ["Other"],
      "Fancy Vans Mobility": ["Other"],
      "FR Conversions": ["Other"],
      "Gator Custom Mobility Inc": ["Other"],
      "Lone Star Handicap Vans": ["Other"],
      Revability: ["Other"],
      "Rollx Vans": ["Other"],
      "United Access": ["Other"],
      Other: ["Other"],
    };
    return convModels[selectedConvManu] || [];
  }, [selectedConvManu]);

  const handleConvManuChange = useCallback((event) => {
    // console.log(event.target.value);
    // requestAnimationFrame(() => {
      setPrevConvModelValue(ConvModelRef.current?.value);
      setSelectedConvManu(event.target.value);
    // });
  });

  const handleConvModelChange = useCallback((e) => {
    // requestAnimationFrame(() => {});
  });

  return (
    <>
      {/* Dropdown input for Conv_Manu, Conv_Model, and Checkboxes for New, Side, Motorized, In-Floor */}
      <Grid templateColumns="repeat(4, 1fr)" gap={4} mt={4} colSpan={8}>
        <GridItem colSpan={6}>
          <Flex direction="row">
            <FormControl>
              <FormLabel fontSize="xs" colSpan={4}>
                Conv_Manu
              </FormLabel>
              <Select
                placeholder="Select Conv_Manu"
                fontSize="xs"
                value={selectedConvManu}
                onChange={handleConvManuChange}
                onBlur={handleInputBlur}
                ref={ConvManuRef}
              >
                <option value="Braun">Braun</option>
                <option value="VMI">VMI</option>
                <option value="AMS">AMS</option>
                <option value="Freedom">Freedom</option>
                <option value="Acadiana Handicap Solutions">
                  Acadiana Handicap Solutions
                </option>
                <option value="Adaptive Vans">Adaptive Vans</option>
                <option value="Advance Mobility Plus">
                  Advance Mobility Plus
                </option>
                <option value="Advanced Modifications, Inc.">
                  Advanced Modifications, Inc.
                </option>
                <option value="ATC: All-Terrain Conversions">
                  All-Terrain Conversions
                </option>
                <option value="ARBOC Specialty Vehicles LLC">
                  ARBOC Specialty Vehicles LLC
                </option>
                <option value="ATS: Asstd. Trans. Sys, & Wilkerson">
                  Asstd. Trans. Sys, & Wilkerson
                </option>
                <option value="Custom Van Conversions & Mobility">
                  Custom Van Conversions & Mobility
                </option>
                <option value="Fancy Van's Mobility">
                  Fancy Vans Mobility
                </option>
                <option value="FR Conversions">FR Conversions</option>
                <option value="Freedom Motors USA">Freedom Motors USA</option>
                <option value="Gator Custom Mobility Inc">
                  Gator Custom Mobility Inc
                </option>
                <option value="Lone Star Handicap Vans">
                  Lone Star Handicap Vans
                </option>
                <option value="Revability">Revability</option>
                <option value="Rollx Vans">Rollx Vans</option>
                <option value="United Access">United Access</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="xs">Conv_Model</FormLabel>
              <Select
                key={selectedConvManu}
                placeholder="Select Conv_Model"
                fontSize="xs"
                onChange={handleConvModelChange}
                ref={ConvModelRef}
              >
                {convModelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};

export default ConvDropdowns;
