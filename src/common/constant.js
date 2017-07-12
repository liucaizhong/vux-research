// grid labels and icon path
export const GRIDS = [{
  label: 'grid_1_label',
  icon: require('@/assets/res_calendar.png'),
  href: '#'
}, {
  label: 'grid_2_label',
  icon: require('@/assets/stock_recommend.png'),
  href: '#'
}, {
  label: 'grid_3_label',
  icon: require('@/assets/attend_calendar.png'),
  href: '#'
}, {
  label: 'grid_4_label',
  icon: require('@/assets/workplan.png'),
  href: 'workplan'
}, {
  label: 'grid_5_label',
  icon: require('@/assets/contacts.png'),
  href: '#'
}, {
  label: 'grid_6_label',
  icon: require('@/assets/conference.png'),
  href: 'activity'
}, {
  label: 'grid_7_label',
  icon: require('@/assets/strategy.png'),
  href: 'salestrategy'
}]

// banner for swiper
// example for outer link: url: 'http://www.baidu.com'
export const BANNERS = [{
  url: '#',
  img: require('@/assets/banner.jpg'),
  title: ''
}]

// define abbr. for deps
export const DEPS = ['research_dep']
// define play types and forms
export const PLANTYPES = ['r', 's', 'i']
export const PLANFORMS = {
  'r': ['comp', 'date', 'event'],
  's': ['stock', 'finishDate', 'reportDate'],
  'i': ['indus', 'finishDate', 'reportDate']
}

// define max rows of data table
export const MAXNUMROWS = 30

// define sales strategy table 1
export const SALESTRATEGYTYPES = ['s1', 's2']
export const SALESTRATEGYFORMS = {
  's1': [{
    name: 'salesPerson',
    value: function (vm) {
      return vm.$store.state.loginfo.loginfo.userName
    }
  }, 'riskPrefer', 'trading1', 'trading2', 'prefered', 'notPrefered',
    'recognition'],
  's2': [{
    name: 'salesPerson',
    value: function (vm) {
      return vm.$store.state.loginfo.loginfo.userName
    }
  }, 'industry', 'oppotunity', 'subindusInterest',
    'reason2', 'stockInterest', 'requirement']
}
export const TRADINGRANGE = ['0%', '10%', '20%', '30%', '40%',
  '50%', '60%', '70%', '80%', '90%', '100%']
export const RISKLEVEL = ['high', 'mid', 'low']
export const INDUSTRY = ['internet_media', 'electronics', 'computer',
  'military_industry', 'auto_industry', 'petrochemical_industry',
  'base_chemistry', 'machinery', 'finance', 'estate_material', 'food_industry',
  'consumer_industry', 'clothing_industry', 'tourism_industry',
  'retailing_industry', 'light_industry', 'medicine_industry',
  'electricity', 'epi', 's_m_value', 'HK_stock']

// define date switch panel
export const LEFTBTNTEXT = ['preWeek', 'preDoubleWeek', 'preMonth', 'preQuarter']
export const RIGHTTBTNTEXT = ['nextWeek', 'nextDoubleWeek', 'nextMonth', 'nextQuarter']
export const DAYMILLISECONDS = 24 * 60 * 60 * 1000
