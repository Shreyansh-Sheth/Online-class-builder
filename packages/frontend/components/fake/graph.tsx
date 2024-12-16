import React, { useEffect } from "react";

import { Bar } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import dynamic from "next/dynamic";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useColorScheme } from "@mantine/hooks";
import { Container, useMantineColorScheme } from "@mantine/core";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// import type { BarOptions } from "chart.js";
export const options = {
  responsive: true,

  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Users Analytics",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = (colorMode: string) => ({
  labels,

  datasets: [
    {
      label: "New Users",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 150 })),
      backgroundColor:
        colorMode === "light"
          ? "rgba(53, 162, 235, 0.9)"
          : "rgba(53, 162, 235, 0.4)",
    },
  ],
});

export default function BarGraph() {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Container>
      <Bar options={options} data={data(colorScheme)} />
    </Container>
  );
}
