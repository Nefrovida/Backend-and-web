import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div>
      <h1>404 página no encontrada</h1>
      <Link to={"/"}>Go back Home</Link>
    </div>
  );
}

export default NotFoundPage;
