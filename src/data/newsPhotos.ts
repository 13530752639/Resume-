/* ─── 新闻摄影 - 图片数据 ─── */

export interface NewsSection {
  name: string
  images: string[]
}

export interface NewsTopic {
  id: string
  title: string
  enTitle: string
  coverImage: string
  introImage: string
  introTitle: string
  introText: string
  sections: NewsSection[]
}

const BASE = '/images/news'

const newsTopic: NewsTopic = {
  id: 'stdx',
  title: '汕头大学东海岸校区',
  enTitle: 'Under-Construction Campus',
  coverImage: `${BASE}/IMG_7434.JPG`,
  introImage: `${BASE}/IMG_7436.jpg`,
  introTitle: '汕头大学东海岸校区｜山海新章，学府生长',
  introText:
    '每一座新城的生长，都是城市与时代的双向奔赴；每一处学府的营建，皆是理想与未来的落地生根。伫立于东海岸新城的山海之畔，汕头大学东海岸校区尚在建设的轮廓，是粤东大地崭新的生长肌理，也是高等教育迭代升级的生动答卷。',
  sections: [
    {
      name: '汕头大学东海岸校区',
      images: [
        'DJI_0254.JPG', 'DJI_0296.JPG', 'DJI_0299.JPG', 'DJI_0326.JPG',
        'DJI_0330.JPG', 'DJI_0335.JPG', 'DJI_0336.JPG', 'DJI_0337.JPG',
        'IMG_7427.jpg', 'IMG_7428.JPG', 'IMG_7429.jpg', 'IMG_7430.JPG',
        'IMG_7431.JPG', 'IMG_7432.JPG', 'IMG_7433.JPG', 'IMG_7434.JPG',
        'IMG_7435.JPG', 'IMG_7436.jpg',
      ].map(f => `${BASE}/${f}`),
    },
  ],
}

export default newsTopic
