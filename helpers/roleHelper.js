export function getRoleByEmail(email) {
  // Customize this per your ISGEC role logic or set up a sheet tab for users/roles
  if (email.endsWith("@isgec.co.in")) return "admin";
  if (email.startsWith("lead")) return "lead";
  if (email.startsWith("pm")) return "pm";
  return "user";
}

export function isAdmin(email) {
  return getRoleByEmail(email) === "admin";
}

export function isLead(email) {
  return getRoleByEmail(email) === "lead";
}

export function isPm(email) {
  return getRoleByEmail(email) === "pm";
}
