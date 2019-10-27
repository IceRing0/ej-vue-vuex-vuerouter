// import request from '@/utils/request'
import {get, post_array,post} from '@/http/axios'
export default {
  namespaced:true,
  state:{
    visible:false,
    comments:[],
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
    }
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
    setTitle(state,title){
      state.title = title;
    }
  },
  actions:{
    async batchDeletecomments(context,ids){
      let response = await post("/comment/batchDelete",{ids});
      context.dispatch("findAllcomments")
      return response;
    },
    // async findAllcomments({commit,dispatch,getters,state}){
    async findAllcomments(context){
      // 1. 查询所有评论信息
      let response = await get("/comment/findAll");
      console.log(response);
      //alert(JSON.stringify(response));
      // 2. 将评论信息设置到state.comments中
      context.commit("refreshcomments",response.data)
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