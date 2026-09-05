export const extractApiData = (
  response: any
) => {
  const body = response?.data;

  if (body?.data !== undefined) {
    return body.data;
  }

  return body;
};

export const extractArray = (
  value: any,
  keys: string[]
): any[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    !value ||
    typeof value !== "object"
  ) {
    return [];
  }

  for (const key of keys) {
    if (
      Array.isArray(value[key])
    ) {
      return value[key];
    }
  }

  return [];
};

export const getName = (
  value: any
): string => {
  if (!value) {
    return "";
  }

  if (
    typeof value === "string"
  ) {
    return value;
  }

  return (
    value.name ??
    value.title ??
    ""
  );
};

export const formatDate = (
  value?: string
): string => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export const getTodayName =
  () => {
    return new Date()
      .toLocaleDateString(
        "en-US",
        {
          weekday: "long",
        }
      )
      .toUpperCase();
  };