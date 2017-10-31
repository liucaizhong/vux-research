# 表1：策略反馈
销售姓名，风险偏好，当前仓位（下限），（上限），偏好行业(最多三个)，不偏好行业(最多三个)，重点推荐个股是否认可,以及认可/不认可的主要原因
'salesPerson', 'riskPrefer', 'trading1', 'trading2', 'prefered', 'notPrefered', 'recognition'
其中 riskPrefer：0（高），1（中），低（2）
trading1，trading2：0，1，。。。10 代表'0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'
# 表2：研究反馈
销售姓名，行业名称，该行业下一季度表现的预期，对子行业的兴趣度排序，主要原因，对个股的兴趣度排序，客户自发提出的研究需求(包含行业和个股)
'salesPerson', 'industry', 'oppotunity', 'subindusInterest', 'reason2', 'stockInterest', 'requirement'

# 返回某个销售名下的数据格式
# s1:策略反馈, s2:研究反馈
{
  's1': [{
    id: '1',
    salesPerson: '杨筱蓉',
    riskPrefer: '1',  
    trading1: '4',
    trading2: '6',
    prefered: '金融/地产/电子',
    notPrefered: '军工/计算机',
    recognition: '分众：中性。基本面认可，但公司减持压力太大，现在的价位比较尴尬。环旭：中性。市场上跟踪公司情况的卖方多，我们并不具备深度跟踪优势'
  }],
  's2': [{
    id: '2',
    salesPerson: '杨筱蓉',
    industry: '6',
    oppotunity: '有机硅可能会有机会',
    subindusInterest: '有机硅>民爆>煤化工',
    reason2: '认可有机硅的涨价逻辑，民爆复苏认可不过标的少市值小参与度不大。煤化工认为订单不可持续',
    stockInterest: '新安股份、雷鸣科化、雪峰科技',
    requirement: '基础化工子产业链的梳理'
  }]
}

# 可能需要：销售会分权限，高权限销售可以查看当前时间段内所有销售的反馈，一般销售只能查看自己的反馈
# 查询, 两种数据请求参数
# 策略反馈
* type: s1
* start: 起始日期 （YYYY.MM.DD）
* end: 结束日期 （YYYY.MM.DD）
* userId：销售用户ID

# 研究反馈
* type: s2
* year: 年度 （2017）
* quarter: 季度（0，1，2，3）
* userId：销售用户ID

# 新增，删除，更新（和工作计划基本一致）
# 两种数据请求参数
# 策略反馈
* type: s1
* start: 起始日期 （YYYY.MM.DD）
* end: 结束日期 （YYYY.MM.DD）
* userId：销售用户ID
* data: [{
#id空为新增
  id: '',
  salesPerson: '杨筱蓉',
  riskPrefer: '1',  
  trading1: '4',
  trading2: '6',
  prefered: '金融/地产/电子',
  notPrefered: '军工/计算机',
  recognition: '分众：中性。基本面认可，但公司减持压力太大，现在的价位比较尴尬。环旭：中性。市场上跟踪公司情况的卖方多，我们并不具备深度跟踪优势'
}，{
# id有值，下面域有值则为修改
  id: '1',
  salesPerson: '杨筱蓉',
  riskPrefer: '1',  
  trading1: '4',
  trading2: '6',
  prefered: '金融/地产/电子',
  notPrefered: '军工/计算机',
  recognition: '分众：中性。基本面认可，但公司减持压力太大，现在的价位比较尴尬。环旭：中性。市场上跟踪公司情况的卖方多，我们并不具备深度跟踪优势'
}，{
# id有值，下面域无值则为删除
  id: '2',
  }]
# 研究反馈
* type: s2
* year: 年度 （2017）
* quarter: 季度（0，1，2，3）
* userId：销售用户ID
* data: [{
#id空为新增
  id: '',
  salesPerson: '杨筱蓉',
  industry: '6',
  oppotunity: '有机硅可能会有机会',
  subindusInterest: '有机硅>民爆>煤化工',
  reason2: '认可有机硅的涨价逻辑，民爆复苏认可不过标的少市值小参与度不大。煤化工认为订单不可持续',
  stockInterest: '新安股份、雷鸣科化、雪峰科技',
  requirement: '基础化工子产业链的梳理'
},{
# id有值，下面域有值则为修改
  id: '1',
  salesPerson: '杨筱蓉',
  industry: '6',
  oppotunity: '有机硅可能会有机会',
  subindusInterest: '有机硅>民爆>煤化工',
  reason2: '认可有机硅的涨价逻辑，民爆复苏认可不过标的少市值小参与度不大。煤化工认为订单不可持续',
  stockInterest: '新安股份、雷鸣科化、雪峰科技',
  requirement: '基础化工子产业链的梳理'
}, {
# id有值，下面域无值则为删除
  id: '2',
}]

# 通知/规章制度
# 新建 post
*title: 通知/规章制度标题
content：通知/规章制度说明、内容、概要
files: 数组，数组元素为对象
例子：
  files: [{
    name: 'dafdfsd.pdf',
    data: FormData对象
  },
  ...]
**

# 获取 get
# params
*id: 通知/规章制度唯一标识符*
# 得到字段如下：
*id：通知/规章制度唯一标识符
title: 通知/规章制度标题
content：通知/规章制度说明、内容、概要
files: 数组，数组元素为对象
createdBy: 创建人（可不返回）
date: 创建时间
例子：
  id: '0',
  title: 'abc',
  createdBy: 'chenjw',
  date: '2017.10.30',
  content: 'adafidf;asdf',
  files: [{
    name: 'dafdfsd.pdf',
    url: 'www.baidu.com'
  }]
**
