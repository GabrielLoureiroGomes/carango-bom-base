import { client } from "../utils";

const dashboardUrl = "/api/dashboard";
const DashboardService = {
  get() {
    return client(dashboardUrl);
  },
};

export default DashboardService;
