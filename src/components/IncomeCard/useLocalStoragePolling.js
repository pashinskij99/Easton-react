// useLocalStoragePolling.js
import { useEffect } from "react";

const useLocalStoragePolling = (key, callback, interval = 200) => {
  useEffect(() => {
    let prevValue = localStorage.getItem(key);

    const checkForChanges = () => {
      const currentValue = localStorage.getItem(key);
      if (currentValue !== prevValue) {
        console.log("Local storage value changed:", currentValue);
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

export default useLocalStoragePolling;
