"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IService } from "@/types/service";

const ServicesTable = ({ services }: { services: IService[] }) => {
  return (
    <Card className="mt-8 border-0 shadow-sm">
      <CardHeader>
        <CardTitle>All Services</CardTitle>
        <CardDescription>
          Complete list of all available services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Service Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Duration
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Required Staff Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{service.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {service.durationMinutes} min
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {service.requiredStaffType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesTable;
