import {
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { stats } from '@/constants';

export default async function HomePage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-default-500">Welcome to your restaurant dashboard.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-2">
            <CardBody className="gap-2">
              <div className="flex justify-between">
                <div>
                  <p className="text-default-500">{stat.name}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
                <div className="rounded-lg bg-default-100 p-2">
                  <Icon icon={stat.icon} className="text-2xl" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Icon
                  icon={
                    stat.changeType === "positive"
                      ? "solar:arrow-up-bold"
                      : stat.changeType === "negative"
                        ? "solar:arrow-down-bold"
                        : "solar:minus-line-bold"
                  }
                  className={
                    stat.changeType === "positive"
                      ? "text-success"
                      : stat.changeType === "negative"
                        ? "text-danger"
                        : "text-default-500"
                  }
                />
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-success"
                      : stat.changeType === "negative"
                        ? "text-danger"
                        : "text-default-500"
                  }
                >
                  {stat.change}
                </span>
                <span className="text-default-400">vs last month</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Recent Orders</p>
              <p className="text-small text-default-500">
                Your most recent orders will appear here
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col items-center justify-center py-6">
              <Icon
                icon="solar:box-minimalistic-bold"
                className="text-4xl text-default-300"
              />
              <p className="mt-2 text-center text-default-500">
                No orders yet
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-md">Popular Items</p>
              <p className="text-small text-default-500">
                Your most ordered menu items
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col items-center justify-center py-6">
              <Icon
                icon="solar:menu-dots-bold"
                className="text-4xl text-default-300"
              />
              <p className="mt-2 text-center text-default-500">
                No menu items yet
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}