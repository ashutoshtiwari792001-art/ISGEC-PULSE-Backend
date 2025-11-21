import { getSheet } from "./sheetService.js";
import moment from "moment";

// Example dashboard stats
export async function getDashboardStats() {
  // Fetch recent project and billing data
  const billingRows = await getSheet("Billing");
  const projectRows = await getSheet("Projects");

  // Calculate monthly totals for current and last month
  const nowMonth = moment().format("YYYY-MM");
  const lastMonth = moment().subtract(1, "month").format("YYYY-MM");
  const getMonth = (dateString) => moment(dateString).format("YYYY-MM");

  let totalBilling = 0;
  let lastMonthBilling = 0;
  let awardedProjects = 0;
  let overdueCount = 0;

  for (const row of billingRows) {
    if (row[6]) { // createdAt
      if (getMonth(row[6]) === nowMonth) totalBilling += Number(row[3]);
      if (getMonth(row[6]) === lastMonth) lastMonthBilling += Number(row[3]);
    }
  }

  awardedProjects = projectRows.filter(r => r[6] === "Active").length;
  overdueCount = projectRows.filter(r => r[6] === "Overdue").length;

  return {
    totalBilling,
    lastMonthBilling,
    awardedProjects,
    overdueCount,
    pmCount: [...new Set(projectRows.map(r => r[3]))].length
  };
}

// ML/AI risk and alert predictions (simple demo logic)
export async function getRiskPredict() {
  // Example: Projects missing billing or marked Overdue get flagged
  const projects = await getSheet("Projects");
  const billing = await getSheet("Billing");

  const criticalProjects = projects.filter(p => p[6] === "Overdue" || !billing.some(b => b[1] === p[0]));
  const risks = criticalProjects.map(p => ({
    projectId: p[0],
    projectName: p[1],
    pmId: p[3],
    color: p[4] || "#999",
    status: p[6]
  }));

  return { risks, message: "Projects at risk detected." };
}

// Project analytics (trends/report)
export async function getProjectAnalytics(projectId) {
  const billing = await getSheet("Billing");
  const projectBilling = billing.filter(b => b[1] === projectId);
  const monthMap = {};
  for (const entry of projectBilling) {
    const month = entry[4]; // month field
    monthMap[month] = (monthMap[month] || 0) + Number(entry[3]);
  }
  return {
    projectId,
    billingTrend: monthMap
  };
}
