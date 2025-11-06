import React, { ReactElement } from "react";

function Title(props: { children: ReactElement | string }) {
  return (
    <h1 className="font-semibold text-2xl text-primary">{props.children}</h1>
  );
}

export default Title;
