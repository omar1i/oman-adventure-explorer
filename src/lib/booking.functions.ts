import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { createClient } from '@supabase/supabase-js';
import { bookingSchema } from './booking-schema';
import type { Database } from '@/integrations/supabase/types';
export const submitBooking=createServerFn({method:'POST'}).inputValidator((input:unknown)=>bookingSchema.parse(input)).handler(async({data})=>{
 const key=process.env['SUPABASE_PUBLISHABLE_KEY'];const url=process.env['SUPABASE_URL'];
 if(!key||!url)return {ok:false as const,error:'unavailable'};
 const client=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const headers=new Headers(init?.headers);if(key.startsWith('sb_')&&headers.get('Authorization')===`Bearer ${key}`)headers.delete('Authorization');headers.set('apikey',key);return fetch(input,{...init,headers})}}});
 const auth=getRequestHeader('authorization');
 if(auth){const token=auth.replace(/^Bearer\s+/i,'');const {error}=await client.auth.getUser(token);if(error)return {ok:false as const,error:'invalid_session'};}
 // Intentionally guest inquiries without account ownership. RLS allows insert only, never reads.
 const {error}=await client.from('booking_requests').insert({...data,id:data.submission_key,email:data.email||null,special_requirements:data.special_requirements||null,additional_notes:data.additional_notes||null});
 if(error){if(error.code==='23505')return {ok:true as const,reference:data.submission_key};console.error('Booking insert failed',error.code);return {ok:false as const,error:'save_failed'};}
 return {ok:true as const,reference:data.submission_key};
});
