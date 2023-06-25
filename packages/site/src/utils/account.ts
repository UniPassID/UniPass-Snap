import { SignInput } from "@/types/requst";
import { sign } from '@/request'


export async function fetchAccessToken(data: SignInput) {
  try {
    const res = await sign(data)
    localStorage.setItem('up__accessToken', res.accessToken)
  } catch (e) {
    console.error('[fetchAccessToken failed]', e)
  }
}