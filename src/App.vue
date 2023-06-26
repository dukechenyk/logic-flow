<template>
  <div class="main">
    <div class="right-content">
      <div v-for="item in typeList" :key="item.type" @click="handleRightAdd(item.type)" class="right-click" :class="`lf-${item.type}`">{{item.name}}</div>
    </div>
    <div class="container" ref="container"></div>
    <el-dialog
      placement="auto"
      width="800px"
      trigger="manual"
      :visible.sync="visible"
    >
      <div class="dialog-content">
        <div v-for="item in typeList" :key="item.type" @click="handleAddNode(item.type)" class="lf-click" :class="`lf-${item.type}`">{{item.name}}</div>
      </div>
    </el-dialog>
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
      enterModel: {},
      visible: false,
      typeList: [{type: 'fillet', name: '圆角'}, {type: 'circle', name: '圆形'}, {type: 'rect', name: '矩形'}]
    }
  },
  mounted() {
    this.lf = new LogicFlow({
      container: this.$refs.container,
      grid: true,
    });
    this.lf.register(customLogic)

    this.lf.render({
      nodes: [
      ],
      edges: [
      ],
    });

    this.lf.on("node:mouseenter",({data}) => {
      this.enterModel = data
    })

    this.lf.on("custom:button-click", ({direction}) => {
      this.visible = true
      this.direction = direction
    });
  },
  methods: {
    handleRightAdd(type){
      const id = this.count + 'add'
      this.lf.addNode({
        type: 'button-node',
        x: 300,
        y: 300,
        id: id,
        text: '节点' + this.count,
        properties: {
          type: type
        }
      });
      this.count += 1
    },
    handleAddNode(type) {
      let x
      let y
      switch (this.direction) {
        case 'top':
          x = this.enterModel.x
          y = this.enterModel.y - 200
          break;
        case 'right':
          x = this.enterModel.x + 200
          y = this.enterModel.y
          break;
        case 'bottom':
          x = this.enterModel.x
          y = this.enterModel.y + 200
          break;
        case 'left':
          x = this.enterModel.x - 200
          y = this.enterModel.y
          break;
        default:
          break;
      }
      const id = this.count + 'add'
      this.lf.addNode({
        type: 'button-node',
        x,
        y,
        id: id,
        text: '节点' + this.count,
        properties: {
          type: type
        }
      });
      this.lf.addEdge({
        sourceNodeId: this.enterModel.id,
        targetNodeId: id,
        type: "polyline",
        text: "连线",
      });
      this.count += 1
      this.visible = false
    }
  }
};
</script>

<style>
body,html{
  width: 100%;
  height: 100%;
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
.right-click{
  cursor: pointer;
  width: 50px;
  height: 50px;
  border: 2px solid #010101;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px 0;
}

 /* 弹窗样式 */
 .dialog-content{
  display: grid;
  grid-template-columns: repeat(4,auto);
  grid-gap: 8px;
}
.lf-click{
  cursor: pointer;
  width: 150px;
  height: 150px;
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


.logic-custom:hover .logic-show{
  display: block;
}
.logic-show{
  position: absolute;
  display: none;
}
.logic-btn{
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-top{
  top: 4px;
  right: 50%;
  transform: translate(50%, 0);
}
.add-right{
  top: 50%;
  right: 4px;
  transform: translate(0, -50%);
}
.add-bottom{
  bottom: 4px;
  right: 50%;
  transform: translate(50%, 0);
}
.add-left{
  top: 50%;
  left: 4px;
  transform: translate(0, -50%);
}
</style>
