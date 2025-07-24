// 全局变量
let currentSection = 'dashboard';
let charts = {};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    setupNavigation();
    updateDashboard();
    renderPersonnelTable();
    renderTransferTable();
    renderAlerts();
    
    // 直接使用CSS图表，不依赖Chart.js
    initializeCSSCharts();
    
    setupEventListeners();
    
    // 定时更新数据
    setInterval(updateDashboard, 60000); // 每分钟更新一次
}

// 设置导航
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // 更新导航状态
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 显示指定部分
function showSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionName).classList.add('active');
    currentSection = sectionName;
    
    // 根据不同部分执行特定操作
    switch(sectionName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'personnel':
            renderPersonnelTable();
            break;
        case 'transfer':
            renderTransferTable();
            break;
        case 'alerts':
            renderAlerts();
            break;
        case 'statistics':
            // 直接渲染CSS图表
            initializeCSSCharts();
            break;
    }
}

// 更新仪表盘
function updateDashboard() {
    updateTransferStatus();
    
    // 更新统计卡片
    document.getElementById('totalEmployees').textContent = personnelData.length;
    document.getElementById('currentTransfers').textContent = getActiveTransfers().length;
    document.getElementById('upcomingAlerts').textContent = getUpcomingTransfers().length;
    
    // 渲染最近活动
    renderRecentActivities();
}

// 更新抽调管理页面统计数据
function updateTransferStats() {
    const totalTransfers = transferData.length;
    const activeTransfers = transferData.filter(t => t.status === '进行中').length;
    const upcomingTransfers = getUpcomingTransfers().length;
    const urgentTransfers = getUrgentTransfers().length;
    const completedTransfers = transferData.filter(t => t.status === '已结束').length;
    
    // 更新统计卡片
    const totalElement = document.getElementById('totalTransfers');
    const activeElement = document.getElementById('activeTransfers');
    const upcomingElement = document.getElementById('upcomingTransfers');
    const urgentElement = document.getElementById('urgentTransfers');
    const completedElement = document.getElementById('completedTransfers');
    
    if (totalElement) totalElement.textContent = totalTransfers;
    if (activeElement) activeElement.textContent = activeTransfers;
    if (upcomingElement) upcomingElement.textContent = upcomingTransfers;
    if (urgentElement) urgentElement.textContent = urgentTransfers;
    if (completedElement) completedElement.textContent = completedTransfers;
}

// 渲染最近活动
function renderRecentActivities() {
    const container = document.getElementById('recentActivities');
    const activities = generateRecentActivities();
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// 渲染人员表格
function renderPersonnelTable() {
    const tbody = document.getElementById('personnelTableBody');
    
    tbody.innerHTML = personnelData.map(person => `
        <tr>
            <td>${person.id}</td>
            <td>${person.name}</td>
            <td>${person.department}</td>
            <td>${person.position}</td>
            <td>${person.company}</td>
            <td>${person.hireDate}</td>
            <td><span class="status-badge status-active">${person.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-view" onclick="viewPersonnel('${person.id}')" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="editPersonnel('${person.id}')" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 渲染抽调表格
function renderTransferTable() {
    const tbody = document.getElementById('transferTableBody');
    
    tbody.innerHTML = transferData.map(transfer => {
        const remainingDays = calculateRemainingDays(transfer.endDate);
        let statusClass, rowClass = '', remainingDaysClass = '';
        
        // 确定状态样式
        if (transfer.status === '已结束') {
            statusClass = 'status-inactive';
        } else if (remainingDays <= 5) {
            statusClass = 'status-critical';
            rowClass = 'transfer-row-critical';
            remainingDaysClass = 'critical';
        } else if (remainingDays <= 10) {
            statusClass = 'status-critical';
            rowClass = 'transfer-row-critical';
            remainingDaysClass = 'critical';
        } else if (remainingDays <= 15) {
            statusClass = 'status-warning';
            remainingDaysClass = 'warning';
        } else {
            statusClass = 'status-active';
        }
        
        // 显示剩余天数
        let remainingDaysText = '';
        if (remainingDays > 0) {
            remainingDaysText = `<span class="remaining-days ${remainingDaysClass}">${remainingDays}天</span>`;
        } else {
            remainingDaysText = '<span class="remaining-days">已结束</span>';
        }
        
        return `
            <tr class="${rowClass}">
                <td>${transfer.id}</td>
                <td>${transfer.employeeName}</td>
                <td>${transfer.originalCompany}</td>
                <td>${transfer.transferDepartment}</td>
                <td>${transfer.startDate}</td>
                <td>${transfer.endDate}</td>
                <td>${remainingDaysText}</td>
                <td><span class="status-badge ${statusClass}">${transfer.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-view" onclick="viewTransferDetail('${transfer.id}')" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-edit" onclick="editTransfer('${transfer.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // 更新抽调管理页面的统计数据
    updateTransferStats();
}

// 渲染提醒
function renderAlerts() {
    const urgentTransfers = getUrgentTransfers();
    const upcomingTransfers = getUpcomingTransfers();
    
    // 更新提醒统计
    document.getElementById('urgentCount').textContent = urgentTransfers.length + ' 条';
    document.getElementById('warningCount').textContent = upcomingTransfers.length + ' 条';
    
    // 渲染提醒列表
    const alertsList = document.getElementById('alertsList');
    const allAlerts = [
        ...urgentTransfers.map(transfer => ({
            ...transfer,
            type: 'urgent',
            title: `${transfer.employeeName} 抽调将在 ${calculateRemainingDays(transfer.endDate)} 天后结束`,
            desc: `来自 ${transfer.originalCompany}，抽调到 ${transfer.transferDepartment}`
        })),
        ...upcomingTransfers.filter(t => calculateRemainingDays(t.endDate) > 5).map(transfer => ({
            ...transfer,
            type: 'warning',
            title: `${transfer.employeeName} 抽调将在 ${calculateRemainingDays(transfer.endDate)} 天后结束`,
            desc: `来自 ${transfer.originalCompany}，抽调到 ${transfer.transferDepartment}`
        }))
    ];
    
    alertsList.innerHTML = allAlerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <div class="alert-item-icon">
                <i class="fas fa-exclamation-${alert.type === 'urgent' ? 'circle' : 'triangle'}"></i>
            </div>
            <div class="alert-item-content">
                <div class="alert-item-title">${alert.title}</div>
                <div class="alert-item-desc">${alert.desc}</div>
            </div>
            <div class="alert-item-actions">
                <button class="btn btn-primary" onclick="viewTransferDetail('${alert.id}')">查看详情</button>
            </div>
        </div>
    `).join('');
}

// 初始化图表
function initializeCharts() {
    // 检查Chart.js是否加载
    if (typeof Chart === 'undefined') {
        console.log('Chart.js not loaded, using CSS charts');
        // 如果Chart.js未加载，显示CSS图表
        showSimpleStats();
        return;
    }

    try {
        // 抽调人员分布图
        const ctx1 = document.getElementById('transferDistributionChart');
        if (ctx1) {
            charts.transferDistribution = new Chart(ctx1.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: statisticsData.transferDistribution.labels,
                    datasets: [{
                        data: statisticsData.transferDistribution.data,
                        backgroundColor: [
                            '#3498db', '#e74c3c', '#2ecc71', '#f39c12',
                            '#9b59b6', '#1abc9c', '#34495e', '#95a5a6',
                            '#e67e22', '#f1c40f', '#8e44ad'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            generateLegend('distributionLegend', statisticsData.transferDistribution, ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#95a5a6', '#e67e22', '#f1c40f', '#8e44ad']);
        }
        
        // 抽调时长统计图
        const ctx2 = document.getElementById('transferDurationChart');
        if (ctx2) {
            charts.transferDuration = new Chart(ctx2.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: statisticsData.transferDuration.labels,
                    datasets: [{
                        label: '人数',
                        data: statisticsData.transferDuration.data,
                        backgroundColor: '#3498db'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // 各子公司抽调人数图
        const ctx3 = document.getElementById('companyTransferChart');
        if (ctx3) {
            charts.companyTransfer = new Chart(ctx3.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: statisticsData.companyTransfer.labels,
                    datasets: [{
                        label: '抽调人数',
                        data: statisticsData.companyTransfer.data,
                        backgroundColor: '#2ecc71'
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // 月度抽调趋势图
        const ctx4 = document.getElementById('monthlyTrendChart');
        if (ctx4) {
            charts.monthlyTrend = new Chart(ctx4.getContext('2d'), {
                type: 'line',
                data: {
                    labels: statisticsData.monthlyTrend.labels,
                    datasets: [{
                        label: '抽调人数',
                        data: statisticsData.monthlyTrend.data,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // 更新统计概览数据
        updateStatisticsOverview();
        
    } catch (error) {
        console.error('Error initializing charts:', error);
        showSimpleStats();
    }
}

// 生成图例
function generateLegend(containerId, data, colors) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = data.labels.map((label, index) => `
        <div class="legend-item">
            <div class="legend-color" style="background-color: ${colors[index]}"></div>
            <span>${label}: ${data.data[index]}</span>
        </div>
    `).join('');
}

// 显示简单统计信息（当Chart.js未加载时）
function showSimpleStats() {
    // 抽调人员分布 - 饼图替代
    const distributionContainer = document.getElementById('transferDistributionChart');
    if (distributionContainer) {
        distributionContainer.parentElement.innerHTML = createDistributionChart();
    }
    
    // 抽调时长统计 - 柱状图替代
    const durationContainer = document.getElementById('transferDurationChart');
    if (durationContainer) {
        durationContainer.parentElement.innerHTML = createDurationChart();
    }
    
    // 各子公司抽调人数 - 横向柱状图替代
    const companyContainer = document.getElementById('companyTransferChart');
    if (companyContainer) {
        companyContainer.parentElement.innerHTML = createCompanyChart();
    }
    
    // 月度抽调趋势 - 折线图替代
    const trendContainer = document.getElementById('monthlyTrendChart');
    if (trendContainer) {
        trendContainer.parentElement.innerHTML = createTrendChart();
    }
}

// 创建分布图表
function createDistributionChart() {
    const data = statisticsData.transferDistribution;
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#95a5a6', '#e67e22', '#f1c40f', '#8e44ad'];
    const total = data.data.reduce((sum, val) => sum + val, 0);
    
    let html = '<div class="css-pie-chart">';
    let currentAngle = 0;
    
    data.labels.forEach((label, index) => {
        const percentage = (data.data[index] / total) * 100;
        const angle = (data.data[index] / total) * 360;
        
        html += `
            <div class="pie-segment" style="
                --start-angle: ${currentAngle}deg;
                --end-angle: ${currentAngle + angle}deg;
                --color: ${colors[index]};
            "></div>
        `;
        currentAngle += angle;
    });
    
    html += '</div>';
    html += '<div class="chart-data-list">';
    data.labels.forEach((label, index) => {
        html += `
            <div class="data-item">
                <span class="data-color" style="background-color: ${colors[index]}"></span>
                <span class="data-label">${label}</span>
                <span class="data-value">${data.data[index]}人</span>
            </div>
        `;
    });
    html += '</div>';
    
    return html;
}

// 创建时长图表
function createDurationChart() {
    const data = statisticsData.transferDuration;
    const maxValue = Math.max(...data.data);
    
    let html = '<div class="css-bar-chart">';
    data.labels.forEach((label, index) => {
        const height = (data.data[index] / maxValue) * 100;
        html += `
            <div class="bar-item">
                <div class="bar" style="height: ${height}%; background-color: #3498db;">
                    <span class="bar-value">${data.data[index]}</span>
                </div>
                <div class="bar-label">${label}</div>
            </div>
        `;
    });
    html += '</div>';
    
    return html;
}

// 创建公司图表
function createCompanyChart() {
    const data = statisticsData.companyTransfer;
    const maxValue = Math.max(...data.data);
    
    let html = '<div class="css-horizontal-bar-chart">';
    data.labels.forEach((label, index) => {
        const width = (data.data[index] / maxValue) * 100;
        html += `
            <div class="h-bar-item">
                <div class="h-bar-label">${label}</div>
                <div class="h-bar-container">
                    <div class="h-bar" style="width: ${width}%; background-color: #2ecc71;">
                        <span class="h-bar-value">${data.data[index]}</span>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    return html;
}

// 创建趋势图表
function createTrendChart() {
    const data = statisticsData.monthlyTrend;
    const maxValue = Math.max(...data.data);
    const minValue = Math.min(...data.data);
    
    let html = '<div class="css-line-chart">';
    html += '<div class="line-chart-container">';
    
    // 创建点和线
    const points = data.data.map((value, index) => {
        const x = (index / (data.data.length - 1)) * 100;
        const y = 100 - ((value - minValue) / (maxValue - minValue)) * 80;
        return { x, y, value };
    });
    
    // 绘制线条
    html += '<svg class="line-svg" viewBox="0 0 100 100">';
    html += '<polyline points="';
    points.forEach(point => {
        html += `${point.x},${point.y} `;
    });
    html += '" fill="none" stroke="#e74c3c" stroke-width="0.5"/>';
    
    // 绘制点
    points.forEach(point => {
        html += `<circle cx="${point.x}" cy="${point.y}" r="1" fill="#e74c3c"/>`;
    });
    html += '</svg>';
    
    // 添加标签
    html += '<div class="line-labels">';
    data.labels.forEach((label, index) => {
        const x = (index / (data.data.length - 1)) * 100;
        html += `<div class="line-label" style="left: ${x}%">${label}</div>`;
    });
    html += '</div>';
    
    // 添加数值
    html += '<div class="line-values">';
    points.forEach((point, index) => {
        html += `<div class="line-value" style="left: ${point.x}%; top: ${point.y}%">${point.value}</div>`;
    });
    html += '</div>';
    
    html += '</div></div>';
    
    return html;
}

// 初始化CSS图表
function initializeCSSCharts() {
    // 抽调人员分布图
    const distributionContainer = document.getElementById('transferDistributionChart');
    if (distributionContainer) {
        distributionContainer.parentElement.innerHTML = createDistributionChart();
    }
    
    // 抽调时长统计图
    const durationContainer = document.getElementById('transferDurationChart');
    if (durationContainer) {
        durationContainer.parentElement.innerHTML = createDurationChart();
    }
    
    // 各子公司抽调人数图
    const companyContainer = document.getElementById('companyTransferChart');
    if (companyContainer) {
        companyContainer.parentElement.innerHTML = createCompanyChart();
    }
    
    // 月度抽调趋势图
    const trendContainer = document.getElementById('monthlyTrendChart');
    if (trendContainer) {
        trendContainer.parentElement.innerHTML = createTrendChart();
    }
    
    // 更新统计概览数据
    updateStatisticsOverview();
}

// 更新统计概览数据
function updateStatisticsOverview() {
    // 计算平均抽调时长
    const activeTransfers = transferData.filter(t => t.status !== '已结束');
    let totalDays = 0;
    activeTransfers.forEach(transfer => {
        const start = new Date(transfer.startDate);
        const end = new Date(transfer.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        totalDays += days;
    });
    const avgDuration = activeTransfers.length > 0 ? Math.round(totalDays / activeTransfers.length) : 0;
    
    // 更新概览数据
    const totalCountEl = document.getElementById('totalTransferCount');
    const avgDurationEl = document.getElementById('avgTransferDuration');
    const companiesEl = document.getElementById('participatingCompanies');
    const monthlyNewEl = document.getElementById('monthlyNewTransfers');
    
    if (totalCountEl) totalCountEl.textContent = transferData.length;
    if (avgDurationEl) avgDurationEl.textContent = avgDuration;
    if (companiesEl) companiesEl.textContent = '8';
    if (monthlyNewEl) monthlyNewEl.textContent = '5';
}

// 更新图表
function updateCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.update();
        }
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    document.getElementById('searchPersonnel').addEventListener('input', function() {
        filterPersonnelTable(this.value);
    });
    
    // 公司筛选
    document.getElementById('companyFilter').addEventListener('change', function() {
        filterPersonnelByCompany(this.value);
    });
    
    // 抽调状态筛选
    document.getElementById('transferStatusFilter').addEventListener('change', function() {
        filterTransferByStatus(this.value);
    });
    
    // 填充员工选择下拉框
    populateEmployeeSelect();
}

// 筛选人员表格
function filterPersonnelTable(searchTerm) {
    const rows = document.querySelectorAll('#personnelTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}

// 按公司筛选人员
function filterPersonnelByCompany(company) {
    const rows = document.querySelectorAll('#personnelTableBody tr');
    rows.forEach(row => {
        const companyCell = row.cells[4].textContent;
        row.style.display = !company || companyCell === company ? '' : 'none';
    });
}

// 按状态筛选抽调
function filterTransferByStatus(status) {
    const rows = document.querySelectorAll('#transferTableBody tr');
    rows.forEach(row => {
        const statusCell = row.cells[7].textContent;
        row.style.display = !status || statusCell.includes(status) ? '' : 'none';
    });
}

// 填充员工选择下拉框
function populateEmployeeSelect() {
    const select = document.getElementById('employeeSelect');
    select.innerHTML = '<option value="">-- 请选择员工 --</option>';
    
    personnelData.forEach(person => {
        const option = document.createElement('option');
        option.value = person.id;
        option.textContent = `${person.name} (${person.company})`;
        select.appendChild(option);
    });
}

// 查看人员详情
function viewPersonnel(id) {
    const person = personnelData.find(p => p.id === id);
    if (person) {
        alert(`员工详情：\n姓名：${person.name}\n工号：${person.id}\n部门：${person.department}\n职位：${person.position}\n公司：${person.company}\n入职时间：${person.hireDate}`);
    }
}

// 编辑人员信息
function editPersonnel(id) {
    alert('编辑功能开发中...');
}

// 查看抽调详情
function viewTransferDetail(id) {
    const transfer = transferData.find(t => t.id === id);
    if (transfer) {
        const remainingDays = calculateRemainingDays(transfer.endDate);
        const content = `
            <div class="transfer-detail">
                <p><strong>抽调编号：</strong>${transfer.id}</p>
                <p><strong>员工姓名：</strong>${transfer.employeeName}</p>
                <p><strong>原公司：</strong>${transfer.originalCompany}</p>
                <p><strong>抽调部门：</strong>${transfer.transferDepartment}</p>
                <p><strong>开始时间：</strong>${transfer.startDate}</p>
                <p><strong>结束时间：</strong>${transfer.endDate}</p>
                <p><strong>剩余天数：</strong>${remainingDays > 0 ? remainingDays + '天' : '已结束'}</p>
                <p><strong>抽调原因：</strong>${transfer.reason}</p>
                <p><strong>当前状态：</strong>${transfer.status}</p>
            </div>
        `;
        
        document.getElementById('transferDetailContent').innerHTML = content;
        showModal('transferDetailModal');
    }
}

// 编辑抽调信息
function editTransfer(id) {
    alert('编辑功能开发中...');
}

// 显示新增抽调模态框
function showAddTransferModal() {
    showModal('addTransferModal');
}

// 新增抽调
function addNewTransfer() {
    const form = document.getElementById('addTransferForm');
    const formData = new FormData(form);
    
    // 这里应该验证表单数据并添加到数据中
    alert('新增抽调功能开发中...');
    closeModal('addTransferModal');
}

// 延长抽调
function extendTransfer() {
    alert('延长抽调功能开发中...');
    closeModal('transferDetailModal');
}

// 显示模态框
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

// 关闭模态框
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 点击模态框外部关闭
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});