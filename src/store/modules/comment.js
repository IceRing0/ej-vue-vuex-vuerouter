// import request from '@/utils/request'
import {get, post_array,post} from '@/http/axios'
export default {
  namespaced:true,
  state:{
    visible:false,
    comments:[],
    orders:[],
    title:"添加评论信息"
  },
  getters:{
    countcomments:(state)=>{
      return state.comments.length;
    },
    // 需要为获取器传递参数的写法
    commentstatusFilter:(state)=>{
      return function(status){
        if(status){
          return state.comments.filter(item=>item.status===status)
        } else {
          return state.comments;
        }
      }
    },
    orderstatusFilter:(state)=>{
      return function(status){
        if(status){
          return state.orders.filter(item=>item.status===status)
        } else {
          return state.orders;
        }
      }
    },
  },
  mutations:{
    showModal(state){
      state.visible = true;
    },
    closeModal(state){
      state.visible = false;
    },
    // 需要接受一个参数，这个参数就是comments
    refreshcomments(state,comments){
      state.comments = comments;
    },
    refreshOrders(state,orders){
      state.orders = orders;
    },
    setTitle(state,title){
      state.title = title;
    }
  },
  actions:{
    async batchDeletecomments(context,ids){
      // 1. 批量删除
      let response = await post_array("/comment/batchDelete",{ids});
      // 2. 分发
      context.dispatch("findAllcomments");
      // 3. 返回结果
      return response;
    },
    async findAllComments(context){
      // 1. 查询所有评论信息
      let response = await get("/comment/findAll");
      //alert(JSON.stringify(response));
      // 2. 将评论信息设置到state.comments中
      context.commit("refreshcomments",response.data)
    },
    async findAllOrders(context){
      // 1. ajax查询
      let response = await get("/order/findAll");
      // 2. 将查询结果更新到state中
      context.commit("refreshOrders",response.data);
    },
    async deletecommentById({dispatch},id){
      // 1. 删除评论信息
      let response = await get("/comment/deleteById?id="+id);
      // 2. 刷新
      dispatch("findAllcomments")
      // 3. 提示成功
      return response;
    },
    async saveOrUpdatecomment({dispatch,commit},comment){
      // 1. 提交请求
      let response = await post("/comment/saveOrUpdate",comment)
      // 2. 关闭模态
      commit("closeModal");
      // 3. 刷新页面
      dispatch("findAllcomments");
      // 4. 提示成功 react
      return response;
    }
  }
}