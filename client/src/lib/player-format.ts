export function formatBirthDate(birthDate: string | null | undefined): string | null {
  if (!birthDate) {
    return null;
  }

  const date = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateAge(birthDate: string | null | undefined): number | null {
  if (!birthDate) {
    return null;
  }

  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
}

export function formatHeight(heightCm: number | null | undefined): string | null {
  if (!heightCm) {
    return null;
  }

  return `${Math.round(heightCm)} cm`;
}

export function formatPlayerStats(
  birthDate: string | null | undefined,
  heightCm: number | null | undefined,
): string | null {
  const parts: string[] = [];
  const birthday = formatBirthDate(birthDate);
  const age = calculateAge(birthDate);
  const height = formatHeight(heightCm);

  if (birthday) {
    parts.push(birthday);
  }

  if (age !== null) {
    parts.push(`${age} yrs`);
  }

  if (height) {
    parts.push(height);
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}
