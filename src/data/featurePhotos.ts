/* ─── 专题摄影 - 图片数据 ─── */

export interface FeatureTopic {
  id: string
  title: string
  introImage: string
  introTitle: string
  introText: string
  images: string[]
}

const R2_URL = 'https://pub-2983cdf1cba64ea6afdc17a670917f94.r2.dev'
const BASE = R2_URL + '/images/feature'

const featureTopic: FeatureTopic = {
  id: 'food',
  title: '美食',
  introImage: `${BASE}/01.jpg`,
  introTitle: '美食｜烟火藏本草，潮味养流年',
  introText:
    '潮汕地处粤东，历史人文厚重，是知名侨乡，潮汕饮食融汇中原、闽粤饮食精髓，自成一派，养生属性尤为突出。本地水土丰饶、物产充沛，为潮菜奠定食材根基。潮人依体质、节气择食，恪守 "应时而食"，盛夏多食草粿、海石花等清润吃食；善以本土草本入膳、药食同源，如鼠曲粿用料鼠曲草可食疗健体。潮菜凝练出清、淡、甘、和的饮食特质，处处蕴含养生智慧。深挖潮汕饮食养生内涵，既可传承潮汕饮食文脉，也能为国内菜系与大众日常养生提供参考',
  images: [
    '02.jpg', '03.jpg', '04.jpg', '05.jpg',
    '06.jpg', '07.jpg', '08.jpg', '09.jpg', '010.jpg',
    '011.jpg', '012.jpg', '013.jpg', '014.jpg', '015.jpg',
    '016.jpg', '017.jpg',
  ].map(f => `${BASE}/${f}`),
}

export default featureTopic
