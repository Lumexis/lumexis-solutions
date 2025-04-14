import { Database } from '@supabase/supabase-js'

export interface Tables {
  emailtonotify: {
    Row: {
      id: string
      email: string
      created_at: string | null
    }
    Insert: {
      id?: string
      email: string
      created_at?: string | null
    }
  }
}

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = PostgrestError

export interface PostgrestError {
  message: string
  details: string
  hint: string
  code: string
}