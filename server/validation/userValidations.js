import Joi from 'joi';

const userRegistrationValidation = Joi.object({
    userName: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': `"name" should be a type of 'text'`,
            'string.empty': `"name" cannot be an empty field`,
            'string.min': `"name" should have a minimum length of {#limit}`,
            'string.max': `"name" should have a maximum length of {#limit}`,
            'any.required': `"name" is a required field`
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } }) // Disallow TLDs (e.g., .com, .net)
        .required()
        .custom((value, helpers) => {
            const allowedDomains = ['gmail.com']; // Specify allowed domains
            const domain = value.split('@')[1];
            if (!allowedDomains.includes(domain)) {
                return helpers.message(`Email domain must be one of: ${allowedDomains.join(', ')}`);
            }
            return value; // Return the value if validation passes
        })
        .messages({
            'string.email': `"email" must be a valid email`,
            'any.required': `"email" is a required field`
        }),

    password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{6,30}$')) // Allow specific characters
        .custom((value, helpers) => {
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumbers = /\d/.test(value);
            const hasSpecialChars = /[!@#$%^&*]/.test(value);

            if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
                return helpers.message('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            }
            return value; // Return the value if validation passes
        })
        .messages({
            'string.min': `"password" should have a minimum length of {#limit}`,
            'string.max': `"password" should have a maximum length of {#limit}`,
            'any.required': `"password" is a required field`
        }),

    role: Joi.string()
        .valid('user', 'admin')
        .required()
        .messages({
            'any.required': `"role" is a required field`,
            'any.only': `"role" must be one of: 'user', 'admin'`
        })
        .default('user'),

})



export { userRegistrationValidation }
