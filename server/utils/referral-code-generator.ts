export const generateReferralCode = (arr: string[]): string => {
  const length = 5;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "";
  let isUnique = false;
  while (!isUnique) {
    code = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
    isUnique = !arr.includes(code);
  }
  return code;
};
