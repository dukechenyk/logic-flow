<template>
  <div class="container" ref="container"></div>
</template>

<script>
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";
import customLogic from "./logicflow/customLogic";

export default {
  data() {
    return {
      count: 3,
      enterModel: {}
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
        {
          id: "1",
          type: "button-node",
          x: 100,
          y: 100,
          text: "节点1",
        },
        {
          id: "2",
          type: "circle",
          x: 300,
          y: 200,
          text: "节点2",
        },
      ],
      edges: [
        {
          sourceNodeId: "1",
          targetNodeId: "2",
          type: "polyline",
          text: "连线",
        },
      ],
    });

    this.lf.on("node:mouseenter",({data}) => {
      this.enterModel = data
    })

    this.lf.on("custom:button-click", ({direction}) => {
      let x
      let y
      switch (direction) {
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
        type: "button-node",
        x,
        y,
        id: id,
        text: '节点' + this.count,
      });
      this.lf.addEdge({
        sourceNodeId: this.enterModel.id,
        targetNodeId: id,
        type: "polyline",
        text: "连线",
      });
      this.count += 1
      this.lf.getNodeIncomingNode(this.enterModel.id);
    });
  },
};
</script>

<style>
body,html{
  width: 100%;
  height: 100%;
}
.container {
  width: 100%;
  height: 100%;
}
.logic-custom {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 2px solid #838382;
  box-sizing: border-box;
  position: relative;
}
.logic-custom:hover .logic-btn{
  display: block;
}
.logic-btn{
  position: absolute;
  background: transparent;
  border-radius: 50%;
  display: none;
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
