import React, { ReactElement } from "react";

function Title(props: { children: ReactElement | string, size: string }) {
    if (props.size == "large") {
      return (
        <h1 className="font-semibold text-4xl text-primary mb-4">{props.children}</h1>
      )
    }

    if (props.size == "medium") {
      return (
        <h3 className="font-semibold text-2xl text-primary mb-3">{props.children}</h3>
      )
    }

    if (props.size == "small") {
      return (
        <h5 className="font-semibold text-lg text-primary mb-2">{props.children}</h5>
      )
    }

    if (props.size == "subtitle") {
      return (
        <p className="font-semibold text-base text-primary mb-2">{props.children}</p>
      )
    }

  return (
    <h1 className="font-semibold text-2xl text-primary mb-3">{props.children}</h1>
  );
}

export default Title;
