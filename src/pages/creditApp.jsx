import React, { useEffect } from "react";
import "./home.css";

function CreditApp(props) {
  useEffect(() => {
    //window.open(doc)
    //console.log(doc)
    window.location.href = "/static/media/AppFillablev5.95d4df41.pdf";
    //console.log("displayin")
  });

  return (
    <div>
      <a href="/static/media/AppFillablev5.95d4df41.pdf" target="_blank">
        load PDF
      </a>
    </div>
  );
}

export default CreditApp;
