
import { z } from 'zod';

const emailSchema = z.string().email();
const email = 'admin@med';

const result = emailSchema.safeParse(email);
console.log(`Validation result for '${email}':`, result.success);
if (!result.success) {
  console.log('Error:', result.error.issues);
}
