import React, {useState, useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';
const options = {
    legend : {
        display:false
    },
    elements: {
        point: {
            radius:0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
               gridLines: {
                   display: false,
               },
               ticks: {
                   // include the dollar sign in the ticks 
                   callback: function(value, index, values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}

const buildChartData = (data, caseType='cases')=> {
    const chartData = [];
    let lastDataPoint; // empty object rn
    for(let date in data.cases){
        if(lastDataPoint){
            const newDataPoint = {
                x: date,
                y: data[caseType][date] - lastDataPoint
            }
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[caseType][date];

    }; // loop through all data cases
    return chartData;
};

function LineGraph( {casesType, ...props}){
    const [data, setData] = useState({});
    useEffect (() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                // clever stuff here
                // console.log(data);
                const chartData = buildChartData(data, casesType);
                setData(chartData);
            });
        };

        fetchData();
        
    },[casesType]);


    return (
    <div classname = {props.className}>
      
      {data?.length >0 && (
        <Line 
            options={options}
            data ={{
            datasets: [
                {
                    data: data,
                    borderColor: "#CC1034",
                    backgroundColor: "rgba(204, 16, 52, 0)"
                },
                ],
        }} />
      )}

      {/* <Line>  */}
    </div>
  )
}

export default LineGraph
