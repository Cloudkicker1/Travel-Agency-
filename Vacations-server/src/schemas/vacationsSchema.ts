import joi from "@hapi/joi";

export const vacationsSchema = joi.object({
  Description: joi.string().min(1).max(500).required(),
  Destination: joi.string().min(1).max(500).required(),
  Picture: joi.string().min(1).max(500).required(),
  StarDate: joi.string().required(),
  EndDate: joi.string().required(),
  Price: joi.string().min(1).max(20).required(),
});
