import {validate} from 'validate.js';

export const Str = {
    type: String,
    maxlength: 128,
    trim: true,
    required: true
};

export const Num = {
    type: Number,
    required: true
};

export const Bool = {
    type: Boolean,
    required: true,
    default: false
};

export const Url = {
    ...Str,
    required: false,
    maxlength: 2000,
    validate: {
        validator: (val: string) => validate({val}, {val: {url: true}}),
        message: (val: string) => `'${val}' is not a valid URL.`
    }
};
