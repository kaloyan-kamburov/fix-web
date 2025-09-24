const formatDate = (date: string, locale: string) => {
  return new Date(date) instanceof Date
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(date))
    : date;
};

export default formatDate;
