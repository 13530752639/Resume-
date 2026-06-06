/* ─── 人像摄影 - 图片数据 ─── */

export interface PortraitSection {
  name: string
  images: string[]
}

export interface PortraitTopic {
  id: string
  title: string
  enTitle: string
  coverImage: string
  introImage: string
  introTitle: string
  introText: string
  sections: PortraitSection[]
}

const R2_URL = 'https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev'
const BASE = R2_URL + '/images/portrait'

const portraitTopic: PortraitTopic = {
  id: 'maiden',
  title: '少女',
  enTitle: 'Maiden',
  coverImage: `${BASE}/Oil Painting Girl/A3.JPG`,
  introImage: `${BASE}/Oil Painting Girl/A1.JPG`,
  introTitle: '少女｜温柔赴光，本心归真',
  introText:
    '若说城是人间奔赴，村是岁月本真，园是尘世留白，那少女便是世间所有温柔与纯粹的具象化身。她承载着城市的鲜活朝气，藏着村落的质朴赤诚，也拥着公园一般干净治愈的方寸天地。少女的美好，从不是刻意雕琢的精致，是未经世俗磨平的柔软心性，是眼底盛着清风明月，心底藏着热烈山河。她褪去了世俗的功利浮躁，保留着最纯粹的热爱与赤诚，在烟火人间里从容生长。世间所有喧嚣繁华、静谧安然，最终都沉淀为少女的温柔底色，让我们看见：人间万般景致，最动人的，永远是本心未改、向阳而生的模样。',
  sections: [
    {
      name: '油画少女',
      images: [
        'A1.JPG', 'A2.JPG', 'A3.JPG', 'A4.JPG',
        'A5.JPG', 'A6.JPG', 'A7.JPG', 'A8.JPG',
        'A9.JPG', 'A10.JPG', 'A11.JPG', 'A12.JPG',
      ].map(f => `${BASE}/Oil Painting Girl/${f}`),
    },
    {
      name: '自由少女',
      images: [
        'B1.JPG', 'B2.JPG', 'B3.JPG', 'B4.JPG',
        'B5.JPG', 'B6.JPG', 'B7.JPG', 'B8.JPG',
      ].map(f => `${BASE}/Unbound Woman/${f}`),
    },
    {
      name: '刻板少女',
      images: [
        '7.jpg', 'C1.jpg', 'C2.jpg', 'C3.jpg',
        'C4.jpg', 'C5.jpg',
      ].map(f => `${BASE}/Stereotype Girl/${f}`),
    },
  ],
}

export default portraitTopic
