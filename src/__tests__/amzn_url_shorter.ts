import {
  ShortenURL,
  searchByDP,
  searchByGpGroup,
  searchByObidos,
  Err,
  invalidDomain,
  searchByO,
} from '../amzn_url_shorter'
import { allowDomains } from '../allow_domains'

test('invalidDomain() check www.amazon.co.jp', () => {
  expect(
    invalidDomain(
      'https://www.amazon.co.jp/Go言語による並行処理-Katherine-Cox-Buday/dp/4873118468/ref=sr_1_1?__mk_ja_JP=カタカナ&dchild=1&keywords=Go言語による並行処理&qid=1606873816&sr=8-1'
    )
  ).toBe(false)
})

test('invalidDomain() check www.amazon.cojp', () => {
  expect(
    invalidDomain(
      'https://www.amazon.cojp/Go言語による並行処理-Katherine-Cox-Buday/dp/4873118468/ref=sr_1_1?__mk_ja_JP=カタカナ&dchild=1&keywords=Go言語による並行処理&qid=1606873816&sr=8-1'
    )
  ).toBe(true)
})

test('searchByDP() handle dp successfully', async () => {
  await expect(
    searchByDP(
      'https://www.amazon.co.jp/Go言語による並行処理-Katherine-Cox-Buday/dp/4873118468/ref=sr_1_1?__mk_ja_JP=カタカナ&dchild=1&keywords=Go言語による並行処理&qid=1606873816&sr=8-1'
    )
  ).resolves.toBe('https://www.amazon.co.jp/dp/4873118468')
})

test('searchByDP() handle searchByObidos successfully', async () => {
  await expect(
    searchByObidos('https://www.amazon.co.jp/exec/obidos/ASIN/B00TEY2W4U/?th=1')
  ).resolves.toBe('https://www.amazon.co.jp/dp/B00TEY2W4U')
})

test('searchByO() successfully', async () => {
  await expect(
    searchByO(
      'https://www.amazon.co.jp/o/ASIN/B00TEY2W4U?pf_rd_m=A3RN7G7QC5MWSZ&pf_rd_s=merchandised-search-2&pf_rd_r=GTXQ42P9398K6X2FJBER&pf_rd_t=101&pf_rd_p=3a53c418-a3d9-4295-9b7c-cec4bbc24d66&pf_rd_i=19877613011'
    )
  ).resolves.toBe('https://www.amazon.co.jp/dp/B00TEY2W4U')
})

test('ShortenURL() fail with .cojp', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.cojp/Go言語による並行処理-Katherine-Cox-Buday/dp/4873118468/ref=sr_1_1?__mk_ja_JP=カタカナ&dchild=1&keywords=Go言語による並行処理&qid=1606873816&sr=8-1'
    )
  ).rejects.toThrowError(Err.ErrInvalidDomain)
})

test('ShortenURL() pass with .co.jp', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.co.jp/Go言語による並行処理-Katherine-Cox-Buday/dp/4873118468/ref=sr_1_1?__mk_ja_JP=カタカナ&dchild=1&keywords=Go言語による並行処理&qid=1606873816&sr=8-1'
    )
  ).resolves.toBe('https://www.amazon.co.jp/dp/4873118468')
})

test('ShortenURL() pass with .ca', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.ca/Champion-Reverse-Pullover-Hoodie-Oxford/dp/B01JSQT07K/ref=lp_21420672011_1_2?s=apparel&ie=UTF8&qid=1606896131&sr=1-2'
    )
  ).resolves.toBe('https://www.amazon.ca/dp/B01JSQT07K')
})

test('ShortenURL() pass with .ce', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.ae/Apple-Macbook-13-Inch-1-1Ghz-Eng-KB/dp/B0863D4XJW/ref=sr_1_1?dchild=1&pf_rd_p=315ba4a5-5aa5-47d5-aaa0-09593e05ba32&pf_rd_r=8QJXQVJF1E3W03BDTDDM&qid=1606874597&refinements=p_85%3A15602504031&rps=1&s=computers&sr=1-1'
    )
  ).resolves.toBe('https://www.amazon.ae/dp/B0863D4XJW')
})

test('ShortenURL() pass with .cn', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.cn/dp/B001BL7J92?ref_=Oct_DLandingS_D_e91fd10d_60&smid=A3CQWPW49OI3BQ'
    )
  ).resolves.toBe('https://www.amazon.cn/dp/B001BL7J92')
})

test('ShortenURL() pass with .co.uk', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.co.uk/Introducing-Wireless-earbuds-immersive-reduction/dp/B07FWGBDN6/ref=redir_mobile_desktop?ie=UTF8&ref_=gw_uk_desk_mso_aucc_pg_0920'
    )
  ).resolves.toBe('https://www.amazon.co.uk/dp/B07FWGBDN6')
})

test('ShortenURL() pass with .com', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.com/Samsung-Inch-Internal-MZ-76E1T0B-AM/dp/B078DPCY3T/ref=lp_16225007011_1_2?s=computers-intl-ship&ie=UTF8&qid=1606896380&sr=1-2'
    )
  ).resolves.toBe('https://www.amazon.com/dp/B078DPCY3T')
})

// TODO async ()=> await fn()  をしないとすべてテストがpassする
test('ShortenURL() pass with .com.br', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.com.br/gp/product/B084DWCZY6/ref=s9_acss_bw_cg_adpagepr_1a1_w?pf_rd_m=A3RN7G7QC5MWSZ&pf_rd_s=merchandised-search-2&pf_rd_r=GTXQ42P9398K6X2FJBER&pf_rd_t=101&pf_rd_p=3a53c418-a3d9-4295-9b7c-cec4bbc24d66&pf_rd_i=19877613011'
    )
  ).resolves.toEqual('https://www.amazon.com.br/dp/B084DWCZY6')
})

test('ShortenURL() pass with .com.mx', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.com.mx/Cosco-Taburete-plegable-hogar-Escalones/dp/B002AAZGQG?smid=AVDBXBAVVSXLQ&pf_rd_r=RM31AJ07Y57VTB2B49CW&pf_rd_p=4ad84182-3249-4ed0-aeb0-c151eda6f289'
    )
  ).resolves.toBe('https://www.amazon.com.mx/dp/B002AAZGQG')
})

test('ShortenURL() pass with .com.tr', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.com.tr/Mavi-Bilet-Sophie-Mackintosh/dp/9750746996/?pf_rd_r=Y25KVE0PPMEJRV485XN0&pf_rd_p=0c5a0405-caa9-4902-82b3-773f1eb3edbb&pd_rd_r=36c5a9ab-04c2-4390-895f-902fbce7dbbb&pd_rd_w=iPliQ&pd_rd_wg=Z1BXa&ref_=pd_gw_unk'
    )
  ).resolves.toBe('https://www.amazon.com.tr/dp/9750746996')
})

test('ShortenURL() pass with .de', async () => {
  await expect(
    ShortenURL('https://www.amazon.de/dp/B08JCV3HPM?ref_=Oct_DLandingS_D_f6b5c6d4_NA')
  ).resolves.toBe('https://www.amazon.de/dp/B08JCV3HPM')
})

test('ShortenURL() pass with .es', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.es/Indicode-Caballeros-Acolchada-Entretiempo-Chubasquero/dp/B07WVS599T/?_encoding=UTF8&pd_rd_w=1Sgq3&pf_rd_p=82b32164-797a-46e6-9c42-f74c3b28f03d&pf_rd_r=902VVD64KJMMWGMQYJD6&pd_rd_r=196d91b8-9420-4376-90e0-e85ad0e318b3&pd_rd_wg=lFj96&ref_=pd_gw_unk'
    )
  ).resolves.toBe('https://www.amazon.es/dp/B07WVS599T')
})

test('ShortenURL() pass with .fr', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.fr/dp/B07JQRWLXM/ref=gw_fr_desk_mso_tabl_mst_q420?pf_rd_r=5A45E4SYHN57N7CWWVJ1&pf_rd_p=450fa442-adc3-406c-bd3e-9e0bad77f927'
    )
  ).resolves.toBe('https://www.amazon.fr/dp/B07JQRWLXM')
})

test('ShortenURL() pass with .in', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.in/dp/B085DYWQ85/ref=s9_acsd_al_bw_c2_x_0_i?pf_rd_m=A1K21FY43GMZF8&pf_rd_s=merchandised-search-3&pf_rd_r=ZW6GKSVZFW5CFHRT785Y&pf_rd_t=101&pf_rd_p=9b83a645-b869-4554-8eed-9658c8929fb6&pf_rd_i=13993588031'
    )
  ).resolves.toBe('https://www.amazon.in/dp/B085DYWQ85')
})

test('ShortenURL() pass with .it', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.it/BOLF-Giacca-Uomo-Dunkelblau_ab71-XXXL/dp/B07KT4MRL6/?_encoding=UTF8&pd_rd_w=qV2y9&pf_rd_p=321e3963-702e-47c8-9c05-3def286ce54d&pf_rd_r=8NWYKTWCF2QVXA078BBW&pd_rd_r=c019de6c-2496-4004-8c72-dc0fb1363510&pd_rd_wg=fNweB&ref_=pd_gw_unk'
    )
  ).resolves.toBe('https://www.amazon.it/dp/B07KT4MRL6')
})

test('ShortenURL() pass with .nl', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.nl/dp/B07Q9MJKBV/ref=s9_acsd_al_bw_c2_x_0_t?pf_rd_m=AC5DXSR5G8JPX&pf_rd_s=merchandised-search-3&pf_rd_r=RW9SMZFBDBHH53N3TT0Z&pf_rd_t=101&pf_rd_p=156e478d-5b44-4213-b1df-f5ad3436da7a&pf_rd_i=16365991031'
    )
  ).resolves.toBe('https://www.amazon.nl/dp/B07Q9MJKBV')
})

test('ShortenURL() pass with .sa', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.sa/-/en/%D9%83%D8%A7%D9%85%D9%8A%D8%B1%D8%A7-%D9%86%D9%8A%D9%83%D9%88%D9%86-D5600-%D8%A8%D8%AE%D8%A7%D8%B5%D9%8A%D8%A9-%D8%A7%D9%84%D8%A7%D9%87%D8%AA%D8%B2%D8%A7%D8%B2/dp/B072F2S94Z/ref=br_msw_pdt-5/257-2134039-2158552?_encoding=UTF8&smid=A2XPWB6MYN7ZDK&pf_rd_m=A2XPWB6MYN7ZDK&pf_rd_s=&pf_rd_r=5N1S3M9RQV1EWNS94SHE&pf_rd_t=36701&pf_rd_p=49fc907e-ed46-402e-b1d4-e6c3b5209e66&pf_rd_i=desktop'
    )
  ).resolves.toBe('https://www.amazon.sa/dp/B072F2S94Z')
})

test('ShortenURL() pass with .se', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.se/Sonos-One-Smart-Speaker-Svart/dp/B07P5JHJJT/?_encoding=UTF8&pd_rd_w=wydTI&pf_rd_p=55306034-6b28-4ed7-a933-028a8669e43d&pf_rd_r=1GP4AWZG2ZPRZJPQWJGF&pd_rd_r=e57649f8-2bab-4918-ba4f-417a82dfd9b8&pd_rd_wg=oruIf&ref_=pd_gw_unk'
    )
  ).resolves.toBe('https://www.amazon.se/dp/B07P5JHJJT')
})

test('ShortenURL() pass with .sg', async () => {
  await expect(
    ShortenURL(
      'https://www.amazon.sg/Trideer-Exercise-Anti-Burst-Stability-Supports/dp/B08134V9BM/?_encoding=UTF8&pd_rd_w=vVIEa&pf_rd_p=b7104740-b101-4898-9d1e-04fb307899f5&pf_rd_r=DJ8K55G8T33S5CAKM07G&pd_rd_r=acbee938-7a87-424c-812f-8fd8663ff494&pd_rd_wg=YTitw&ref_=pd_gw_unk'
    )
  ).resolves.toBe('https://www.amazon.sg/dp/B08134V9BM')
})
