import axios from "axios"
import { useEffect, useMemo, useState } from "react"

export const useVin = (vinValue, submission_id) => {
  const [data, setData] = useState(null)
  const [VehAppdata, setVehAppdata] = useState(null)

  const fetchVin = useMemo(async () => {
    try {
      const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vinValue}?format=json`)

      const data = await response.data
  
      return data.Results[0];
    } catch(e) {
      console.log(e)
    }
  }, [vinValue])

  useEffect(async() => {
    if(vinValue?.length === 17) {
      try {
        fetchVin
          .then((data) => {
            setData(data)
          })
          .catch((error) => {
            console.log(error.message)
          })
      } catch(e) {
        
      }
    } else {}
  }, [vinValue, submission_id])

  return {
    data,
    // VehAppdata
  }
}