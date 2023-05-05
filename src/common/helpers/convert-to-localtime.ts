export const convertUtcToLocalTime = (value: any) => {
  var formatedDate = new Date(value);
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    return formatedDate;
  }
  var offset = formatedDate.getTimezoneOffset();
  return new Date(formatedDate.setMinutes(formatedDate.getMinutes() - offset));
};
