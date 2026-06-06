/* ─── 街头摄影 - 图片数据 ─── */

export interface StreetSection {
  name: string
  images: string[]
}

export interface StreetTopic {
  id: string
  title: string
  enTitle: string
  coverImage: string
  introImage: string
  introTitle: string
  introText: string
  sections: StreetSection[]
}

const R2_URL = 'https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev'
const BASE = R2_URL + '/images/street'

const streetTopics: StreetTopic[] = [
  {
    id: 'city',
    title: '城市',
    enTitle: 'City',
    coverImage: `${BASE}/城市/山东/DSC_4467.JPG`,
    introImage: `${BASE}/城市/汕头/IMG_7602.JPG`,
    introTitle: '城市｜烟火筑境，心觅归隅',
    introText:
      '城市是人类文明堆砌的盛大序章，是钢筋水泥浇筑的流动星河。它收纳了无数人的奔赴与理想，以林立楼宇为骨，以车马人流为脉，昼夜不息地更迭着烟火与喧嚣。这里是世俗生活的浓缩，是野心与温柔的共生，人们在这里追逐繁华、奔赴成长，也时常被困于规整的格局与急促的节奏里。城市拓展了生活的边界，却也割裂了人与自然的天然羁绊。我们在城市中谋生、成长、沉浮，终究会发现，这座盛大的容器，装满了人间烟火，也藏着人心深处无处安放的荒芜，让我们始终渴望一场温柔的归栖。',
    sections: [
      {
        name: '山东',
        images: [
          '000005.JPG', '000006.JPG', '000007.JPG', '000017.JPG',
          '000018.JPG', '000019.JPG', '000023.JPG', '000024.JPG',
          '000031.JPG', '000033.JPG', 'DSC_4410.JPG', 'DSC_4445.JPG',
          'DSC_4449.JPG', 'DSC_4455.JPG', 'DSC_4467.JPG', 'DSC_4525.JPG',
          'DSC_4554.JPG', 'DSC_4560.JPG',
        ].map(f => `${BASE}/城市/山东/${f}`),
      },
      {
        name: '汕头',
        images: [
          'IMG_6396.JPG', 'IMG_6399.JPG', 'IMG_6400.JPG', 'IMG_6403.JPG',
          'IMG_7594.JPG', 'IMG_7595.JPG', 'IMG_7596.JPG', 'IMG_7597.JPG',
          'IMG_7598.JPG', 'IMG_7599.JPG', 'IMG_7600.JPG', 'IMG_7601.JPG',
          'IMG_7602.JPG', '建议用这张，后面的店有点潮汕的意思.JPG',
        ].map(f => `${BASE}/城市/汕头/${f}`),
      },
      {
        name: '深圳',
        images: [
          '1f01754ecka55bbc7379e4fb7061a6f9.jpg',
          '3599adb43qdd4429e2eff53b9bffae99.jpg',
          '4bca96066rc53718d0bd7d6ab22e643e.jpg',
          'c4c7720f6t6451c48706a67934e602ca.jpg',
          'd2a433516g262c1d13f35087c667830e.jpg',
          'd5104ef9cia36ee1888b899cb4477ad7.jpg',
          'ebb2511a7ra5f0dfe3e47fca6597efcf.jpg',
          'f8d68cc03o1946e70e2b1a735417922b.jpg',
          'fc419a4e6p3697b34bc857f649f63cf9.jpg',
        ].map(f => `${BASE}/城市/深圳/${f}`),
      },
    ],
  },
  {
    id: 'village',
    title: '村落',
    enTitle: 'Village',
    coverImage: `${BASE}/村落/梅径村/IMG_4701.JPG`,
    introImage: `${BASE}/村落/梅径村/IMG_4699.JPG`,
    introTitle: '村落｜烟火归朴，故土安魂',
    introText:
      '如果说城市是向外的奔赴，村落便是向内的归途。它褪去了都市的精致与浮躁，保留着大地最本真的模样，青砖黛瓦、田埂炊烟、老树晚风，都是时光沉淀下来的温柔。村落是文明的根脉，是城市繁华的源头，它不追赶光阴，只静静守候四季轮回、草木枯荣。在这里，生活褪去了功利的底色，日子慢得可以看见流云、听见风声。它治愈着城市赋予人的疲惫与焦虑，让漂泊的灵魂落地生根。相较于城市的喧嚣蓬勃，村落教会我们回望本心，明白所有盛大的奔赴，终是为了回归质朴的安稳。',
    sections: [
      {
        name: '梅径村',
        images: [
          '61B16764-5A58-47F0-90CF-68F79DD9A898.jpg',
          '89612E8B-1632-42C4-B26A-C372B8BEAE4F.jpg',
          '8EE53382-B7FC-404C-97B0-238D25C37FF7.jpg',
          'AEBF4B78-933B-4FFC-AFAA-45679362FFD3.jpg',
          'DSC_0027.jpg', 'IMG_4692.JPG', 'IMG_4699.JPG',
          'IMG_4701.JPG', 'IMG_4704.JPG', 'IMG_4898.JPG',
          'IMG_4908.JPG', 'IMG_5028.JPG', 'IMG_5488.JPG',
          'IMG_5507.JPG', 'IMG_5631.JPG', 'IMG_5632.JPG',
          'IMG_5644.JPG', 'IMG_5662.jpeg', 'IMG_5663.JPG',
          'IMG_5729.jpeg',
        ].map(f => `${BASE}/村落/梅径村/${f}`),
      },
      {
        name: '南澳',
        images: [
          'IMG_6737.JPG', 'IMG_6738.JPG', 'IMG_6740.JPG',
          'IMG_6741.JPG', 'IMG_6743.JPG', 'IMG_6744.JPG',
          'IMG_6745.JPG', 'IMG_6746.JPG',
        ].map(f => `${BASE}/村落/南澳/${f}`),
      },
      {
        name: '十一合艺术村',
        images: [
          'IMG_4409.JPG', 'IMG_6408.JPG', 'IMG_7542.JPG',
          'IMG_7543.JPG', 'IMG_7545.JPG', 'IMG_7546.JPG',
          'IMG_7547.JPG', 'IMG_7548.JPG', 'IMG_7549.JPG',
          'IMG_7550.JPG',
        ].map(f => `${BASE}/村落/十一合艺术村/${f}`),
      },
      {
        name: '中秋节',
        images: [
          '065e0834ah76b2e59e6557736f596153.jpg',
          '2a1d13e87m5f9178e6b81ea645e95015.jpg',
          '2e7c053e6p59db11deb730a9b1537425.jpg',
          '334a63e47p80e520c03b740bfe6f9f3c.jpg',
          '534dfb751qfe94bdcf1ff15541208146.jpg',
          '6b78b475eq1bc81aae9ca25f5a76c490.jpg',
          '7a900cf9cm90f49cb18256b4c4c0ab07.jpg',
          '890c1e496qcdca6b9c4fa0ec0735b08e.jpg',
          '8a22f2da8mf2a804bb08ec9807d93779.jpg',
          'a320fd3aele964ed704de9b7d6397aea.jpg',
          'd250f1520k4bc787aa0b15758d01778a.jpg',
        ].map(f => `${BASE}/村落/中秋节/${f}`),
      },
    ],
  },
  {
    id: 'park',
    title: '公园',
    enTitle: 'Park',
    coverImage: `${BASE}/公园/神仙里/5DBDC1B7-B633-43D0-8214-91F9D7B5C28B.jpg`,
    introImage: `${BASE}/公园/礐石公园/IMG_6049.JPG`,
    introTitle: '公园｜繁华留白，方寸栖心',
    introText:
      '公园是城市赠予人间的温柔留白，是衔接繁华与质朴的诗意过渡，是介于城市喧嚣与村落静谧之间的第三种生活。它复刻了村落的自然野趣，又扎根于城市的烟火腹地，将山野的清风、草木的温柔，妥帖安放于楼宇之间。它没有村落的悠远沉寂，也没有都市的局促急促，只为奔波的世人提供一处喘息的角落。它是人类对自然的温柔复刻，是我们无法归隐村落时，触手可及的诗意。从奔赴城市的繁华，到眷恋村落的质朴，最终我们在公园读懂：真正的生活，是身处喧嚣，亦能坐拥自然，心有归处，时时安然。',
    sections: [
      {
        name: '礐石公园',
        images: [
          'IMG_6010.JPG', 'IMG_6040.JPG', 'IMG_6041.JPG',
          'IMG_6042.JPG', 'IMG_6043.JPG', 'IMG_6044.JPG',
          'IMG_6045.JPG', 'IMG_6046.JPG', 'IMG_6047.JPG',
          'IMG_6048.JPG', 'IMG_6049.JPG', 'IMG_6050.JPG',
        ].map(f => `${BASE}/公园/礐石公园/${f}`),
      },
      {
        name: '神仙里',
        images: [
          '133BC2E9-C827-4F74-BF9D-682C2D79DBC0.jpg',
          '5DBDC1B7-B633-43D0-8214-91F9D7B5C28B.jpg',
          '8EECD26E-6672-4B36-90D9-8A50FC82B2AD.jpg',
          'D9DBDD32-C1EA-4BE8-AB88-8940C1CF6C3A.jpg',
          'IMG_5029.JPG',
        ].map(f => `${BASE}/公园/神仙里/${f}`),
      },
    ],
  },
]

export default streetTopics
