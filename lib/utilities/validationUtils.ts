const passwordPattern = /[A-Za-z0-9!()?_`~#$^&*+=]/;
const stringPattern = /^[\w ]*$/;
const hexColorPattern = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/;
const phone = /^(?:\+\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export const regExPatterns = {
    passwordPattern,
    stringPattern,
    hexColorPattern,
    phone,
};

export const validationConstants = {};
