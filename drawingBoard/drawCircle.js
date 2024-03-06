const board = document.getElementById("myBoard")
// 存放已经绘制的圆的位置数组
let circles = []
// 判断获取的元素是否支持getContext元素，如果支持，说明是Canvas元素
if (board.getContext) {
    // 获取一个 2D 渲染上下文
    const ctx = board.getContext('2d')
    // 判断鼠标是否已经按下
    let isDown = false
    // 获取当前圆点的位置
    let curCircleIndex = null
    // 鼠标点击
    document.addEventListener('mousedown', (e) => {
        isDown = true
        // 获取x,y坐标
        const { x, y } = getPosition(e.clientX, e.clientY)
        // 处理当前鼠标位置已经存在的圆的下标
        curCircleIndex = handleExist(x, y)
        // 当前位置不存在圆
        if (curCircleIndex === -1) {
            // 重新渲染
            render(x, y)
            // 当前鼠标位置的圆的下标
            curCircleIndex = circles.length - 1
        }

    })
    // 鼠标移动
    document.addEventListener('mousemove', (e) => {
        if (isDown) {
            // 获取x,y坐标
            const { x, y } = getPosition(e.clientX, e.clientY)
            // 删除当前正在拖动的圆点
            if (curCircleIndex !== null) {
                circles.splice(curCircleIndex, 1)
            }
            // 随着鼠标移动实时渲染
            render(x, y)
            // 获取最新的圆的下标
            curCircleIndex = circles.length - 1
        }
    })
    // 鼠标释放
    document.addEventListener('mouseup', () => {
        isDown = false
        // 鼠标放开后，将当前拖动的圆归为null值
        curCircleIndex = null
    })
    // 获取鼠标相对于canvas画布的位置
    function getPosition(globalX, globalY) {
        // 获取 Canvas 在页面中的位置
        const rect = board.getBoundingClientRect();
        // 计算相对位置
        const x = globalX - rect.left
        const y = globalY - rect.top
        return { x: x, y: y }
    }
    // 查找周边是否已存在圆，返回周边最近圆的下标，没有最近圆返回-1
    function handleExist(x, y) {
        // 获取下标
        let existCircleIndex = circles.findIndex(c => Math.sqrt(Math.pow(c.x - x, 2) + Math.pow(c.y - y, 2)) <= 18)
        // 存在圆
        if (existCircleIndex !== -1) {
            // 返回已存在圆的下标
            return existCircleIndex
        }
        return -1
    }
    // 渲染
    function render(x, y) {
        // 将当前坐标存入circles数组
        circles.push({ x: x, y: y })
        // 清除画布
        ctx.clearRect(0, 0, board.width, board.height)
        // 遍历circles数组绘制圆点
        circles.forEach(c => {
            // 开始一个新的绘画路径，防止每次绘制的圆之间有多余路径
            ctx.beginPath()
            // 绘制一个圆，x,y为中心坐标，10为半径，从0-2π
            ctx.arc(c.x, c.y, 10, 0, Math.PI * 2)
            // 填充路径
            ctx.fill()
        })
    }
}