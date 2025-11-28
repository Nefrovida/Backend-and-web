import React, { ReactElement } from "react";

function Title({
  size = "medium",
  children,
}: {
  size?: string;
  children: ReactElement | string;
}) {
  if (size == "large") {
    return (
      <h1 className="font-semibold text-4xl text-primary mb-4">{children}</h1>
    );
  }

  if (size == "medium") {
    return (
      <h3 className="font-semibold text-2xl text-primary mb-3">{children}</h3>
    );
  }

  if (size == "small") {
    return (
      <h5 className="font-semibold text-lg text-primary mb-2">{children}</h5>
    );
  }

  if (size == "subtitle") {
    return (
      <p className="font-semibold text-base text-primary mb-2">{children}</p>
    );
  }

  return <h1 className="font-semibold text-2xl text-primary">{children}</h1>;
}

export default Title;
