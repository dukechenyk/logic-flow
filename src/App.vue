<template>
  <div class="main">
    <div class="right-content">
      <div v-for="item in typeList" :key="item.type" class="right-box" >
        <div @click="handleRightAdd(item)" class="right-click" :class="`lf-${item.type}`"></div>
        {{item.name}}
      </div>
    </div>
    <div class="container" ref="container"></div>
  </div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import customLogic from "./logicflow/customLogic";

export default {
  data() {
    return {
      count: 1,
      enterNode: {},
      enterEdge: {},
      direction: '',
      transItem: {
        x: 0,
        y: 0
      },
      cilent: {
        top: 0,
        left: 0
      },
      popoverItem: {
        top: 0,
        left: 0
      },
      showPopover: false,
      typeList: [
        {type: 'fillet', name: '圆角', width: 100, height: 80},
        {type: 'circle', name: '圆形', width: 80, height: 80},
        {type: 'rect', name: '矩形', width: 100, height: 50},
      ]
    }
  },
  mounted() {
    this.lf = new LogicFlow({
      container: this.$refs.container,
      grid: true,
      stopZoomGraph: true, // 禁止缩放
      // stopScrollGraph: true, // 禁止鼠标滚动移动画布
      keyboard: {
        enabled: true,
        shortcuts: [
          {
            keys: ["backspace"],
            callback: () => {
              this.lf.deleteEdge(this.enterEdge.id)
              this.lf.deleteNode(this.enterNode.id)
              this.enterEdge = {}
              this.enterNode = {}
            },
          },
        ],
      },
    });
    this.lf.register(customLogic)
    this.lf.render({
      nodes: [
      ],
      edges: [
      ],
    });
    // 节点点击事件
    this.lf.on("node:click", ({data}) => {
      this.hiddenLogic()
      if(data?.id != this.enterNode?.id){
        this.enterNode = data
        this.enterEdge = {}
        const popover = document.getElementById(`logic-custom-popover${data.id}`);
        popover.classList.add('show-logic-show')
        popover.classList.remove('hidden-logic-show')
      }
    });
    // 节点拖拽事件
    this.lf.on("node:dragstart", () => {
      this.hiddenPopover()
    })

    // 边点击事件
    this.lf.on("edge:click", ({data}) => {
      this.hiddenLogic()
      this.enterEdge = data
      this.enterNode = {}
    });
    // 画布鼠标抬起事件
    this.lf.on("blank:mousedown", () => {
      this.hiddenLogic()
      this.hiddenPopover()
    });
    // 选择节点类型
    this.lf.on("custom:button-type", ({typeItem}) => {
      this.handleAddNode(typeItem, this.direction)
      this.hiddenPopover()
    });
    // 点击快速添加按钮
    this.lf.on("custom:button-data", ({direction}) => {
      this.direction = direction
      this.setLogicXy(direction)
    });
    // 画布平移
    this.lf.on("graph:transform", ({transform}) => {
      console.log(transform)
      // 上次移动的坐标点距离
      const transItemX = this.transItem.x
      const transItemY = this.transItem.y
      // 移动后的坐标点距离
      const transformX = transform.TRANSLATE_X
      const transformY = transform.TRANSLATE_Y
      // 保留上次移动点
      this.transItem = {
        x: transformX,
        y: transformY
      }
      this.cilent = {
        top: this.cilent.top + (transformY - transItemY),
        left: this.cilent.left + (transformX - transItemX),
      }
      console.log(this.cilent)
      if(this.showPopover){
        this.setPopoverMove()
      }
    });
  },
  methods: {
    // 设置快速添加节点弹出框位置
    setLogicXy(direction){
      let popovertop = 0;
      let popoverleft = 0;
      let top = 0;
      let left = 0;
      const e = event || window.event;  //标准化事件对象
      if (e.pageX || e.pageY) {  //获取鼠标指针的当前坐标值
        popovertop = e.pageY;
        popoverleft = e.pageX;
      } else if (e.clientX || e.clientY) {
        popovertop = event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
        popoverleft = event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
      }
      // 获取选择组件高度
      const popoverHeight = Math.ceil(this.typeList?.length / 2) * 60 + 30

      switch (direction) {
        case 'top':
          top = popovertop - popoverHeight
          left = popoverleft + 10
          break;
        case 'right':
          top = popovertop
          left = popoverleft + 10
          break;
        case 'bottom':
          top = popovertop + 10
          left = popoverleft
          break;
        case 'left':
          top = popovertop
          left = popoverleft - 100
          break;
        default:
          break;
      }
      this.popoverItem = {top, left}
      const logic = document.getElementById(`logic-custom-popover${this.enterNode.id}`);
      logic.style = `--popover-top: ${top}px; --popover-left: ${left}px`
      this.hiddenLogic()
      const popover = document.getElementById(`mypopover${this.enterNode.id}`);
      popover?.showPopover();
      this.showPopover = true
      this.cilent = {top: 0, left: 0}
    },
    // 移动画布修改popover位置
    setPopoverMove(){
      const top = this.popoverItem.top + this.cilent.top
      const left = this.popoverItem.left + this.cilent.left
      const logic = document.getElementById(`logic-custom-popover${this.enterNode.id}`);
      logic.style = `--popover-top: ${top}px; --popover-left: ${left}px`
    },
    // 隐藏快速添加节点按钮
    hiddenLogic(){
      if(this.enterNode?.id){
        const logicCustom = document.getElementById(`logic-custom-popover${this.enterNode.id}`);
        logicCustom.classList.add('hidden-logic-show')
        logicCustom.classList.remove('show-logic-show')
      }
      this.showPopover = false
      this.lf.clearSelectElements();
    },
    hiddenPopover(){
      if(this.enterNode?.id && this.showPopover){
        const popover = document.getElementById(`mypopover${this.enterNode.id}`);
        popover?.hidePopover();
      }
      this.lf.clearSelectElements();
      this.enterEdge = {}
      this.enterNode = {}
    },
    // 侧边栏添加节点
    handleRightAdd(item){
      const nodeId = 'node_' + this.count
      this.lf.addNode({
        type: 'button-node',
        x: 300,
        y: 300,
        id: nodeId,
        text: item.name,
        properties: {
          type: item.type,
          width: item.width,
          height: item.height
        }
      });
      this.count += 1
    },
    // 快速添加节点和连线
    handleAddNode(item, direction) {
      let x
      let y
      switch (direction) {
        case 'top':
          x = this.enterNode.x
          y = this.enterNode.y - 200
          break;
        case 'right':
          x = this.enterNode.x + 200
          y = this.enterNode.y
          break;
        case 'bottom':
          x = this.enterNode.x
          y = this.enterNode.y + 200
          break;
        case 'left':
          x = this.enterNode.x - 200
          y = this.enterNode.y
          break;
        default:
          break;
      }
      const nodeId = 'node_' + this.count
      const edgeId = 'edge_' + this.count
      this.lf.addNode({
        type: 'button-node',
        x,
        y,
        id: nodeId,
        text: item.name,
        properties: {
          type: item.type,
          width: item.width,
          height: item.height
        }
      });
      this.lf.addEdge({
        sourceNodeId: this.enterNode.id,
        targetNodeId: nodeId,
        id: edgeId,
        type: "polyline",
        text: "",
      });
      this.count += 1
    }
  }
};
</script>

<style>
@import './logicflow/logic.css';
body,html{
  width: 100%;
  height: 100%;
}
foreignObject{
  overflow: visible;
}
.container,.main {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 侧边栏样式 */
.right-content{
  position: absolute;
  left: 8px;
  top: 10%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0px 4px 10px 2px #ccc;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  z-index: 999;
}

.right-box{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 60px;
  font-size: 12px;
  padding: 0 8px;
}

.right-click{
  cursor: pointer;
  width: 30px;
  height: 30px;
  border: 2px solid #010101;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px 0;
}

 /* 弹窗样式 */
 .dialog-content{
  display: grid;
  grid-template-columns: repeat(2,auto);
  grid-gap: 8px;
}

.dialog-box{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 60px;
  font-size: 12px;
}

.lf-click{
  cursor: pointer;
  width: 30px;
  height: 30px;
  font-size: 12px;
  border: 2px solid #010101;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lf-fillet{
  border-radius: 8px;
}
.lf-circle{
  border-radius: 50%;
}
.lf-rect{
  border-radius: 0;
  height: 15px;
}


/* 自定义流程样式 */
.logic-custom {
  background-color: #fff;
  width: 100%;
  height: 100%;
  border: 2px solid #000000;
  box-sizing: border-box;
  position: relative;
}
.logic-rect{
  border-radius: 0;
}
.logic-circle{
  border-radius: 50%;
}
.logic-fillet{
  border-radius: 10px;
}

.show-logic-show .logic-show{
  position: absolute;
  display: block;
}
.hidden-logic-show .logic-show{
  position: absolute;
  display: none;
}
.logic-btn{
  background-color: #c8e3ff;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-top{
  top: -25px;
  right: 50%;
  transform: translate(50%, 0);
}
.add-right{
  top: 50%;
  right: -25px;
  transform: translate(0, -50%);
}
.add-bottom{
  bottom: -25px;
  right: 50%;
  transform: translate(50%, 0);
}
.add-left{
  top: 50%;
  left: -25px;
  transform: translate(0, -50%);
}
</style>
