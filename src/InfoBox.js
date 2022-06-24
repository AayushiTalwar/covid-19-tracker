// creating the box component which will be having different info based on what box we are working on
import React from 'react'
import "./InfoBox.css";
import {Card, CardContent, Typography} from "@material-ui/core"
function InfoBox({title, cases, isRed, active, total, ...props}) {
  return (
    <Card 
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
        <CardContent>
            {/* Title of the infoBox */}
            <Typography className="infoBox__title" color = "textSecondary">
                {title}
            </Typography>
            {/* new add ons to the no of cases */}

            <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>
            {/* total no of cases */}

            <Typography className = "infoBox__total" color = "textSecondary">
                {total} Total
            </Typography>
        </CardContent>
    </Card>
  )
}

export default InfoBox
