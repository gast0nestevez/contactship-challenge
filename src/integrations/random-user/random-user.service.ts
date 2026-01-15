import { Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class RandomUserService {
  async fetchUsers(count: number) {
    const { data } = await axios.get(
      `https://randomuser.me/api/?results=${count}`
    )

    return data.results
  }
}
