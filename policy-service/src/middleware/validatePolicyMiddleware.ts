import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response, NextFunction } from 'express';
import * as policySchema from '../schemas/pola.policy.schema.v2-5.json';

const ajv = new Ajv({ strict: false });
addFormats(ajv);

const validatePolicy = ajv.compile(policySchema);

export const validatePolicyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isValid = validatePolicy(req.body);
  if (!isValid) {
    console.error('Validation failed:', validatePolicy.errors);
    return res.status(400).json({ error: validatePolicy.errors });
  }
  next();
};

