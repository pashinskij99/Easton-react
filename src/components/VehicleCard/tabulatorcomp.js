import React, { useRef, useEffect } from 'react';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { ReactTabulator } from 'react-tabulator';
import VehicleCard from './index.js';

const TabulatorTablex = ({ VehDBdata }) => {
  const tableRef = useRef();

    const columns = [
        { title: "Chassis", field: "chassis"},
        { title: "Conv_Type", field: "conv_type"},
        { title: "Mileage", field: "mileage"},
        { title: "Price", field: "price"},
        { title: "Dealer", field: "dealer"},
        { title: "Chassis_Newused", field: "chassis_newused"},
        { title: "Conv_Newused", field: "conv_newused"},
        { title: "Conv_Rearside", field: "conv_rearside"},
        { title: "Conv_Auto", field: "conv_auto"},
        { title: "Conv_Model", field: "conv_model"},
        { title: "Convprice_Est", field: "convprice_est"},
        { title: "Chassisyear", field: "chassisyear"},
        { title: "Avgmilesperyr", field: "avgmilesperyr"},
        { title: "Vin", field: "vin"},
        { title: "Convprice", field: "convprice"},
        { title: "Conv_Infloor", field: "conv_infloor"},
        { title: "Conv_Manu", field: "conv_manu"},
        { title: "Chassis_Retail", field: "chassis_retail"},
        { title: "Chassis_Privateparty", field: "chassis_privateparty"},
        { title: "Chassis_Tradein", field: "chassis_tradein"},
        { title: "Valuation_Mileage", field: "valuation_mileage"},
        { title: "Conv_Implied_Vs_Retail", field: "conv_implied_vs_retail"},
        { title: "Conv_Implied_Vs_Privateparty", field: "conv_implied_vs_privateparty"},
        { title: "Conv_Implied_Vs_Tradein", field: "conv_implied_vs_tradein"},
        { title: "Valuation_Mileage_Est_Diff", field: "valuation_mileage_est_diff"},
        { title: "Valuation_Mileage_Adj", field: "valuation_mileage_adj"},
        { title: "Commercial", field: "commercial"},
        { title: "Bothnew", field: "bothnew"},
        { title: "Chassisprice_Est", field: "chassisprice_est"},
        { title: "Fullprice_Est", field: "fullprice_est"},
        { title: "Fullhalf_Cut", field: "fullhalf_cut"}
          ];

  const options = {
    height: "100%",
    pagination: "local",
    paginationSize: 10,
    layout: "fitColumns",
    responsiveLayout: "collapse",
  };

  useEffect(() => {
    let isMounted = true; // Add a flag to track the mounted state

    if (isMounted && tableRef.current) {
      tableRef.current.table.setData(VehDBdata);
    }

    // Cleanup function to set the flag to false when the component is unmounted
    return () => {
      isMounted = false;
    };
  }, [VehDBdata]);

  return (
    <div>
      <ReactTabulator
        ref={tableRef}
        columns={columns}
        data={VehDBdata}
        options={options}
      />
    </div>
  );
};

export default TabulatorTablex;
