"use client";
import { Card, DonutChart, List, ListItem } from "@tremor/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const data = [
  {
    name: "Rental",
    amount: 6730,
    color: "bg-cyan-500",
  },
  {
    name: "Salaries & wages",
    amount: 4120,
    color: "bg-blue-500",
  },
  {
    name: "Internet & WIFI",
    amount: 3920,
    color: "bg-indigo-500",
  },
  {
    name: "Electricity & Water",
    amount: 3210,
    color: "bg-violet-500",
  },
  {
    name: "Licenses & Permits",
    amount: 3010,
    color: "bg-fuchsia-500",
  },
];

const currencyFormatter = (number: any) => {
  return "$" + Intl.NumberFormat("us").format(number).toString();
};

export default function Donut_Chart() {
  return (
    <>
      <Card className="sm:mx-auto">
        <h1 className="text-2xl font-semibold leading-none tracking-tight text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Operating Expense
        </h1>
        <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Overview of your operating expenses per month.
        </p>
        <DonutChart
          className="mt-5"
          data={data}
          category="amount"
          index="name"
          valueFormatter={currencyFormatter}
          showTooltip={false}
          colors={["cyan", "blue", "indigo", "violet", "fuchsia"]}
        />
        <p className="mt-8 flex items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content">
          <span>Name</span>
          <span>Amount</span>
        </p>
        <List className="mt-2">
          {data.map((item) => (
            <ListItem key={item.name} className="space-x-6">
              <div className="flex items-center space-x-2.5 truncate">
                <span
                  className={classNames(
                    item.color,
                    "h-2.5 w-2.5 shrink-0 rounded-sm"
                  )}
                  aria-hidden={true}
                />
                <span className="truncate dark:text-dark-tremor-content-emphasis">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {currencyFormatter(item.amount)}
                </span>
              </div>
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  );
}
