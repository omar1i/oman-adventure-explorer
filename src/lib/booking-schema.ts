import { z } from 'zod';
export const experienceIds=['sea-fishing','private-boat','camping-escape','private-camping','outdoor-exploration','mountain-adventure'] as const;
export function muscatToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Muscat',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export const bookingSchema=z.object({
 submission_key:z.string().uuid(),
 experience_id:z.enum(experienceIds),
 customer_name:z.string().trim().min(2).max(100),
 contact_number:z.string().trim().regex(/^\+[0-9 ()-]{7,24}$/),
 email:z.union([z.string().trim().email().max(255),z.literal('')]).optional(),
 preferred_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(d=>!Number.isNaN(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d&&d>=muscatToday()),
 participant_count:z.number().int().min(1).max(200),
 preferred_language:z.enum(['en','ar']),
 special_requirements:z.string().trim().max(2000).optional(),
 additional_notes:z.string().trim().max(2000).optional(),
});
export type BookingInput=z.infer<typeof bookingSchema>;
