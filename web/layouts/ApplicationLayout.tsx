import * as React from "react";
import { Component } from "react";

type Props = {
  children: React.ReactChild;
};

export const BasicContainer = ({ children }: Props) => {
  return <div className="container">{children}</div>;
};

export const ApplicationLayout = ({ children }: Props) => {
  return (
    <>
      <BasicContainer>{children}</BasicContainer>
    </>
  );
};
