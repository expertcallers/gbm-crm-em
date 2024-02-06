import React from "react";
import logo from "../assets/logo.png";

type Props = {
  className?: string;
};

const Logo: React.FC<Props> = ({ className }) => {
  return <img src={logo} />;
};

export default React.memo(Logo);
