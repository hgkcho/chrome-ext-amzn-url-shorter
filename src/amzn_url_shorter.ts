import { allowDomains } from './allow_domains'

export const Err = {
  ErrInvalidDomain: 'invalid domain',
} as const
type Err = typeof Err[keyof typeof Err]

export function invalidDomain(url: string): boolean {
  let ret: boolean = false
  url.split('/').map((value: string, idx: number, array: string[]) => {
    if (idx === 2) {
      if (!allowDomains.includes(value)) {
        ret = true
      }
    }
  })
  return ret
}

// shorten annoying amazon url
// i.e. https://www.amazon.co.jp/Go言語による並行処理-Katherine-Cox-Buday/dp/4873118468/ref=sr_1_1?__mk_ja_JP=カタカナ&dchild=1&keywords=Go言語による並行処理&qid=1606873816&sr=8-1    ===>   https://www.amazon.co.jp/dp/4873118468
export function ShortenURL(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (invalidDomain(url)) {
      reject(new Error(Err.ErrInvalidDomain))
    }
    const candidates: string[] = await Promise.all([
      searchByDP(url),
      searchByGpProduct(url),
      searchByObidos(url),
      searchByO(url),
    ])
    candidates.map((v) => {
      if (v !== '') {
        resolve(v)
      }
    })
    resolve('')
  })
}

// This handles https://www.amazon.co.jp/o/ASIN/XXXXXXXXXX pattern
export async function searchByO(url: string): Promise<string> {
  let ret: string = ''
  let returnEmpty: boolean = true
  url.split('/').forEach((value, idx, array) => {
    if (idx === 0) {
      ret += value + '//'
    }
    if (idx === 2) {
      ret += value + '/'
    }
    if (value === 'o' && array[idx + 1] === 'ASIN') {
      returnEmpty = false
      ret += 'dp/' + array[idx + 2]
    }
  })
  ret = ret.split('?').shift()
  if (returnEmpty) {
    return Promise.resolve('')
  }
  return Promise.resolve(ret)
}

// This handles format like https://www.amazon.co.jp/exec/obidos/ASIN/B00TEY2W72/
export async function searchByObidos(url: string): Promise<string> {
  let ret: string = ''
  let returnEmpty: boolean = true
  url.split('/').forEach((value, idx, array) => {
    if (idx === 0) {
      ret += value + '//'
    }
    if (idx === 2) {
      ret += value + '/'
    }
    if (value === 'exec' && array[idx + 1] === 'obidos' && array[idx + 2] === 'ASIN') {
      returnEmpty = false
      ret += 'dp/' + array[idx + 3]
    }
  })
  ret = ret.split('?').shift()
  if (returnEmpty) {
    return Promise.resolve('')
  }
  return Promise.resolve(ret)
}

// This handles format like "https://www.amazon.co.jp/gp/product/B00TEY2W72/"
export async function searchByGpProduct(url: string): Promise<string> {
  let ret: string = ''
  let returnEmpty: boolean = true
  url.split('/').forEach((value, idx, array) => {
    if (idx === 0) {
      ret += value + '//'
    }
    if (idx === 2) {
      ret += value + '/'
    }
    if (value === 'gp' && array[idx + 1] === 'product') {
      returnEmpty = false
      ret += 'dp/' + array[idx + 2]
    }
  })
  ret = ret.split('?').shift()
  if (returnEmpty) {
    return Promise.resolve('')
  }
  return Promise.resolve(ret)
}

export async function searchByDP(url: string): Promise<string> {
  let ret: string = ''
  let returnEmpty: boolean = true
  url.split('/').forEach((value, idx, array) => {
    if (idx === 0) {
      ret += value + '//'
    }
    if (idx === 2) {
      ret += value + '/'
    }
    if (value === 'dp') {
      returnEmpty = false
      ret += 'dp/' + array[idx + 1]
    }
  })
  ret = ret.split('?').shift()
  if (returnEmpty) {
    return Promise.resolve('')
  }
  return Promise.resolve(ret)
}
