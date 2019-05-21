import joi from '@hapi/joi'

export default joi.object().keys({
  name: joi.string()
    .min(2)
    .max(20)
    .required(),
  teamId: joi.number()
    .optional()
})