import React from 'react';
import { Line, Doughnut } from "react-chartjs-2";
import {
    CategoryScale,
    Chart as Chartjs,
    Tooltip,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Legend,
    plugins,
    scales
} from "chart.js";
import { getLastSevendays } from '../../lib/features';
import { Purple, PurpleLight, orange, orangeLight } from '../../constants/color';
import { purple } from '@mui/material/colors';

const labels = getLastSevendays();

Chartjs.register(
    Tooltip,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Filler,
    ArcElement,
    Legend
);

const lineChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false,
            },
        },
    },
}

const LineChart = ({ value = [] }) => {

    const data = {
        labels,
        datasets: [
        {
            data: value,
            label: "Message",
            fill: true,
            backgroundColor: "rgba(175,192,192,0.5)",
            borderColor: "rgba(75,12,192,1)",
        },
        ],
    }
    return (
        <Line data={data} options={lineChartOptions} />
    )
};

const doughnutChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
    cutout:120,
};

const DoughnutChart = ({ value = [], labels = [] }) => {
    const data = {
        labels,
        datasets: [
            {
                data: value,
                label: "Total Chats vs Group Chats",
                fill: true,
                backgroundColor: [PurpleLight, orangeLight],
                hoverBackgroundColor: [Purple,orange],
                borderColor: [Purple, orange],
                offset: 25,
            },
        ],
    }

    return (
        <Doughnut 
        style={{zIndex:10}}
        data={data} options={doughnutChartOptions}/>
    )
}


export { DoughnutChart, LineChart };
