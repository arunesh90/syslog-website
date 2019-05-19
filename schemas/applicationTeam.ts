import joi from '@hapi/joi'

export default joi.object().keys({
  name     : joi.string()
    .min(2)
    .max(20)
    .required(),
  memberIds: joi.array()
    .items(joi.number())
    .max(10)
    .optional()
})
