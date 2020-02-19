import React from 'react'
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import RuleInputPanels from "../RuleInput/RuleInputPanels";


function ProjectDescriptions(props) {
  const { rules, onInputChange, classes } = props;

  return (<div>
    <h1 className="tdm-wizard-page-title">
      Welcome to Los Angeles' TDM Calculator
    </h1>
    <h3 className="tdm-wizard-page-subtitle">
      First, let's name your project
    </h3>
     <RuleInputPanels
      rules={rules}
      onInputChange={onInputChange}
      suppressHeader={true}
    />
  </div>)
}

export default ProjectDescriptions