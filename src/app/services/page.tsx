import { getDashboardSummary } from "@/actions/dashboard";

const ServicesPage = async () => {
  const data = await getDashboardSummary();

  console.log("llllllllllllllll", { data });

  return (
    <div>
      <h1>This is ServicesPage component</h1>
    </div>
  );
};

export default ServicesPage;
