import React from "react";
import "./Flow.css";

const NodeRedEmbed = () => {
  const hostname = window.location.hostname;
  const iframeSrc = `http://${hostname}:1880`;

  return (
    <div className="flowedit">
      <iframe className="iframe" title="Node-RED" src={iframeSrc}></iframe>
    </div>
  );
};

export default NodeRedEmbed;
