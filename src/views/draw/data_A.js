var data_A = {
    name: '流程A',
    nodeList: [{
            detail: "这个流程是通过数据对比，得到的数据",
            icon: "md-git-pull-request",
            id: "数据过滤0",
            left: "267px",
            name: "数据过滤",
            show: true,
            status: "准备状态",
            top: "227px"
        },
        {
            detail: "这个流程是通过数据对比，得到的数据",
            icon: "md-git-pull-request",
            id: "数据对比1",
            left: "715px",
            name: "数据对比",
            show: true,
            status: "准备状态",
            top: "193px"
        },
        {
            detail: "这个流程是通过数据对比，得到的数据",
            icon: "md-play",
            id: "开始2",
            left: "177px",
            name: "开始",
            show: true,
            status: "准备状态",
            top: "99px"
        }
    ],
    lineList: [
        { from: "开始2", to: "数据过滤0" },
        { from: "数据过滤0", to: "数据对比1" },
        { from: "数据对比1", to: "结束3" }
    ]
}

export function getDataA() {
    return data_A
}