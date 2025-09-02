// Format relative time (e.g., "2 minutes ago", "1 hour ago")
export const formatRelativeTime = (date) => {
  if (!date) return "";

  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now - targetDate;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "Baru saja";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  } else {
    return targetDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
};

// Format date to Indonesian locale
export const formatDate = (date, options = {}) => {
  if (!date) return "";

  const defaultOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  };

  return new Date(date).toLocaleDateString("id-ID", defaultOptions);
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format currency (Indonesian Rupiah)
export const formatCurrency = (amount) => {
  if (!amount) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format number with thousand separators
export const formatNumber = (number) => {
  if (!number) return "0";

  return new Intl.NumberFormat("id-ID").format(number);
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return "0%";

  return `${Number(value).toFixed(decimals)}%`;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + "...";
};

// Format grade with letter equivalent
export const formatGrade = (score) => {
  if (!score && score !== 0) return "N/A";

  let letter = "F";
  if (score >= 90) letter = "A";
  else if (score >= 80) letter = "B";
  else if (score >= 70) letter = "C";
  else if (score >= 60) letter = "D";

  return `${score} (${letter})`;
};

// Format phone number (Indonesian format)
export const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as Indonesian phone number
  if (cleaned.startsWith("62")) {
    // International format
    return `+${cleaned.substring(0, 2)} ${cleaned.substring(
      2,
      5
    )} ${cleaned.substring(5, 9)} ${cleaned.substring(9)}`;
  } else if (cleaned.startsWith("0")) {
    // Local format
    return `${cleaned.substring(0, 4)}-${cleaned.substring(
      4,
      8
    )}-${cleaned.substring(8)}`;
  }

  return phone;
};
