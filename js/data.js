// 模拟数据
const personnelData = [
    {
        id: 'WD001',
        name: '张明',
        department: '研发部',
        position: '高级工程师',
        company: '文达科技',
        hireDate: '2020-03-15',
        status: '在职'
    },
    {
        id: 'WD002',
        name: '李华',
        department: '市场部',
        position: '市场经理',
        company: '文达贸易',
        hireDate: '2019-07-20',
        status: '在职'
    },
    {
        id: 'WD003',
        name: '王芳',
        department: '财务部',
        position: '财务主管',
        company: '文达投资',
        hireDate: '2021-01-10',
        status: '在职'
    },
    {
        id: 'WD004',
        name: '刘强',
        department: '生产部',
        position: '生产主管',
        company: '文达制造',
        hireDate: '2018-09-05',
        status: '在职'
    },
    {
        id: 'WD005',
        name: '陈静',
        department: '人力资源部',
        position: 'HR专员',
        company: '文达物流',
        hireDate: '2020-11-12',
        status: '在职'
    },
    {
        id: 'WD006',
        name: '赵磊',
        department: '技术部',
        position: '技术总监',
        company: '文达新能源',
        hireDate: '2017-05-30',
        status: '在职'
    },
    {
        id: 'WD007',
        name: '孙丽',
        department: '销售部',
        position: '销售经理',
        company: '文达地产',
        hireDate: '2019-12-08',
        status: '在职'
    },
    {
        id: 'WD008',
        name: '周伟',
        department: '法务部',
        position: '法务顾问',
        company: '文达金融',
        hireDate: '2020-06-25',
        status: '在职'
    },
    {
        id: 'WD009',
        name: '吴敏',
        department: '行政部',
        position: '行政助理',
        company: '文达科技',
        hireDate: '2021-03-18',
        status: '在职'
    },
    {
        id: 'WD010',
        name: '马超',
        department: '研发部',
        position: '软件工程师',
        company: '文达制造',
        hireDate: '2020-08-14',
        status: '在职'
    },
    {
        id: 'WD011',
        name: '杨洋',
        department: '市场部',
        position: '市场专员',
        company: '文达贸易',
        hireDate: '2021-05-22',
        status: '在职'
    },
    {
        id: 'WD012',
        name: '黄鹏',
        department: '运营部',
        position: '运营经理',
        company: '文达物流',
        hireDate: '2019-10-15',
        status: '在职'
    },
    {
        id: 'WD013',
        name: '林峰',
        department: '投资部',
        position: '投资分析师',
        company: '文达投资',
        hireDate: '2020-04-08',
        status: '在职'
    },
    {
        id: 'WD014',
        name: '徐娟',
        department: '风控部',
        position: '风控专员',
        company: '文达金融',
        hireDate: '2019-08-22',
        status: '在职'
    },
    {
        id: 'WD015',
        name: '谢强',
        department: '工程部',
        position: '工程监理',
        company: '文达地产',
        hireDate: '2018-11-30',
        status: '在职'
    }
];

// 动态生成抽调数据，基于当前日期
function generateTransferData() {
    const today = new Date();
    
    // 辅助函数：添加天数到日期
    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().split('T')[0];
    }
    
    // 辅助函数：减去天数
    function subtractDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result.toISOString().split('T')[0];
    }
    
    return [
        // 紧急提醒 - 2天后到期
        {
            id: 'T001',
            employeeId: 'WD015',
            employeeName: '谢强',
            originalCompany: '文达地产',
            transferDepartment: '工程部',
            startDate: subtractDays(today, 60),
            endDate: addDays(today, 2),
            reason: '总部大楼装修改造项目，负责工程质量监督管理',
            status: '进行中'
        },
        // 紧急提醒 - 3天后到期
        {
            id: 'T002',
            employeeId: 'WD001',
            employeeName: '张明',
            originalCompany: '文达科技',
            transferDepartment: '研发部',
            startDate: subtractDays(today, 55),
            endDate: addDays(today, 3),
            reason: '总部ERP系统升级项目技术支持，负责核心模块开发',
            status: '进行中'
        },
        // 紧急提醒 - 5天后到期
        {
            id: 'T003',
            employeeId: 'WD002',
            employeeName: '李华',
            originalCompany: '文达贸易',
            transferDepartment: '市场部',
            startDate: subtractDays(today, 50),
            endDate: addDays(today, 5),
            reason: '协助总部开拓海外市场，负责国际业务拓展',
            status: '进行中'
        },
        // 即将到期提醒 - 8天后到期
        {
            id: 'T004',
            employeeId: 'WD010',
            employeeName: '马超',
            originalCompany: '文达制造',
            transferDepartment: '研发部',
            startDate: subtractDays(today, 45),
            endDate: addDays(today, 8),
            reason: '制造执行系统(MES)升级开发，负责生产数据分析模块',
            status: '进行中'
        },
        // 即将到期提醒 - 10天后到期
        {
            id: 'T005',
            employeeId: 'WD003',
            employeeName: '王芳',
            originalCompany: '文达投资',
            transferDepartment: '财务部',
            startDate: subtractDays(today, 50),
            endDate: addDays(today, 10),
            reason: '年度财务审计工作，协助完成集团财务报表编制',
            status: '进行中'
        },
        // 即将到期提醒 - 11天后到期
        {
            id: 'T006',
            employeeId: 'WD012',
            employeeName: '黄鹏',
            originalCompany: '文达物流',
            transferDepartment: '运营部',
            startDate: subtractDays(today, 40),
            endDate: addDays(today, 11),
            reason: '供应链管理系统优化，负责物流运营流程标准化',
            status: '进行中'
        },
        // 即将到期提醒 - 12天后到期
        {
            id: 'T007',
            employeeId: 'WD004',
            employeeName: '刘强',
            originalCompany: '文达制造',
            transferDepartment: '生产部',
            startDate: subtractDays(today, 48),
            endDate: addDays(today, 12),
            reason: '生产流程数字化改造项目，指导智能制造系统实施',
            status: '进行中'
        },
        // 即将到期提醒 - 15天后到期
        {
            id: 'T008',
            employeeId: 'WD005',
            employeeName: '陈静',
            originalCompany: '文达物流',
            transferDepartment: '人力资源部',
            startDate: subtractDays(today, 45),
            endDate: addDays(today, 15),
            reason: '人事制度改革支持，协助建立新的绩效考核体系',
            status: '进行中'
        },
        // 正常进行中 - 30天后到期
        {
            id: 'T009',
            employeeId: 'WD006',
            employeeName: '赵磊',
            originalCompany: '文达新能源',
            transferDepartment: '技术部',
            startDate: subtractDays(today, 30),
            endDate: addDays(today, 30),
            reason: '新能源技术研发指导，负责太阳能项目技术攻关',
            status: '进行中'
        },
        // 正常进行中 - 35天后到期
        {
            id: 'T010',
            employeeId: 'WD008',
            employeeName: '周伟',
            originalCompany: '文达金融',
            transferDepartment: '法务部',
            startDate: subtractDays(today, 25),
            endDate: addDays(today, 35),
            reason: '重要并购项目法务支持，负责合同审核和风险评估',
            status: '进行中'
        },
        // 正常进行中 - 50天后到期
        {
            id: 'T011',
            employeeId: 'WD009',
            employeeName: '吴敏',
            originalCompany: '文达科技',
            transferDepartment: '行政部',
            startDate: subtractDays(today, 10),
            endDate: addDays(today, 50),
            reason: '总部办公环境改善项目，负责新办公区域规划设计',
            status: '进行中'
        },
        // 正常进行中 - 55天后到期
        {
            id: 'T012',
            employeeId: 'WD011',
            employeeName: '杨洋',
            originalCompany: '文达贸易',
            transferDepartment: '市场部',
            startDate: subtractDays(today, 5),
            endDate: addDays(today, 55),
            reason: '新产品推广活动策划，负责春季产品发布会筹备',
            status: '进行中'
        },
        // 长期抽调 - 90天后到期
        {
            id: 'T013',
            employeeId: 'WD013',
            employeeName: '林峰',
            originalCompany: '文达投资',
            transferDepartment: '战略规划部',
            startDate: subtractDays(today, 30),
            endDate: addDays(today, 90),
            reason: '集团五年发展规划制定，负责投资项目可行性分析',
            status: '进行中'
        },
        // 已结束的抽调
        {
            id: 'T014',
            employeeId: 'WD007',
            employeeName: '孙丽',
            originalCompany: '文达地产',
            transferDepartment: '销售部',
            startDate: subtractDays(today, 90),
            endDate: subtractDays(today, 30),
            reason: '年终销售冲刺支持，协助完成年度销售目标',
            status: '已结束'
        },
        // 已结束的长期抽调
        {
            id: 'T015',
            employeeId: 'WD014',
            employeeName: '徐娟',
            originalCompany: '文达金融',
            transferDepartment: '风控部',
            startDate: subtractDays(today, 150),
            endDate: subtractDays(today, 10),
            reason: '金融风险管控体系建设，负责风险评估模型优化',
            status: '已结束'
        }
    ];
}

// 生成抽调数据
const transferData = generateTransferData();

// 计算剩余天数
function calculateRemainingDays(endDate) {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// 更新抽调状态
function updateTransferStatus() {
    transferData.forEach(transfer => {
        if (transfer.status === '进行中') {
            const remainingDays = calculateRemainingDays(transfer.endDate);
            if (remainingDays <= 0) {
                transfer.status = '已结束';
            } else if (remainingDays <= 15) {
                transfer.status = '即将到期';
            }
        }
    });
}

// 获取活动抽调数据
function getActiveTransfers() {
    return transferData.filter(transfer => transfer.status === '进行中' || transfer.status === '即将到期');
}

// 获取即将到期的抽调
function getUpcomingTransfers() {
    return transferData.filter(transfer => {
        const remainingDays = calculateRemainingDays(transfer.endDate);
        return remainingDays <= 15 && remainingDays > 0;
    });
}

// 获取紧急提醒（5天内到期）
function getUrgentTransfers() {
    return transferData.filter(transfer => {
        const remainingDays = calculateRemainingDays(transfer.endDate);
        return remainingDays <= 5 && remainingDays > 0;
    });
}

// 生成最近活动数据
function generateRecentActivities() {
    const urgentTransfers = getUrgentTransfers();
    const upcomingTransfers = getUpcomingTransfers().filter(t => calculateRemainingDays(t.endDate) > 5);
    
    const activities = [];
    
    // 添加紧急提醒活动
    urgentTransfers.forEach((transfer, index) => {
        const remainingDays = calculateRemainingDays(transfer.endDate);
        activities.push({
            type: 'urgent',
            title: `${transfer.employeeName} 抽调将在${remainingDays}天后结束 - 紧急提醒`,
            time: index === 0 ? '刚刚' : `${(index + 1) * 10}分钟前`,
            icon: 'fas fa-exclamation-circle'
        });
    });
    
    // 添加即将到期提醒活动
    upcomingTransfers.slice(0, 2).forEach((transfer, index) => {
        const remainingDays = calculateRemainingDays(transfer.endDate);
        activities.push({
            type: 'alert',
            title: `${transfer.employeeName} 抽调将在${remainingDays}天后结束`,
            time: `${index + 1}小时前`,
            icon: 'fas fa-exclamation-triangle'
        });
    });
    
    // 添加其他活动
    activities.push(
        {
            type: 'transfer',
            title: '林峰 开始长期抽调到战略规划部',
            time: '1天前',
            icon: 'fas fa-user-plus'
        },
        {
            type: 'complete',
            title: '徐娟 风控项目抽调工作已完成',
            time: '2天前',
            icon: 'fas fa-check-circle'
        }
    );
    
    return activities.slice(0, 6); // 只返回前6个活动
}

// 统计数据
const statisticsData = {
    transferDistribution: {
        labels: ['研发部', '市场部', '财务部', '人力资源部', '技术部', '法务部', '行政部', '生产部', '运营部', '战略规划部', '工程部'],
        data: [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    transferDuration: {
        labels: ['1-2个月', '2-3个月', '3-4个月', '4个月以上'],
        data: [9, 4, 2, 0]
    },
    companyTransfer: {
        labels: ['文达科技', '文达贸易', '文达投资', '文达制造', '文达物流', '文达新能源', '文达地产', '文达金融'],
        data: [2, 2, 2, 2, 2, 1, 2, 2]
    },
    monthlyTrend: {
        labels: ['8月', '9月', '10月', '11月', '12月', '1月'],
        data: [3, 4, 5, 7, 9, 12]
    }
};

// 初始化时更新状态
updateTransferStatus();